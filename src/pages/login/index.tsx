import { useState, useEffect } from 'react';
import {
	Stack,
	TextInput,
	Center,
	Button,
	Space,
	Text,
	Flex,
} from '@mantine/core';
import styled from 'styled-components';
import { rem } from 'polished';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { STORAGE_CUR_USER_KEY } from '../../constants';
import { makeApiCall } from '@/utils';
import { LoginResponse } from '@/types/api';
import GradientLayout from '@/components/layout/GradientLayout';
import { Page } from '../_app';
import { Loading } from '@/components/common/Loading';

const StyledContainer = styled.div`
	background-color: ${props => props.theme.background.primary};
	border-radius: ${rem(8)};
	color: ${props => props.theme.text.primary};
	padding: ${rem(16)} ${rem(32)};

	width: ${rem(350)};

	.mantine-TextInput-root {
		padding: 0 ${rem(32)};
	}

	@media screen and (max-width: 900px) {
		width: ${rem(350)};
		.mantine-TextInput-root {
			padding: 0 ${rem(48)};
		}
	}

	@media screen and (max-width: 500px) {
		width: 90%;
		.mantine-TextInput-root {
			padding: 0;
		}
	}
`;

enum LoginErrors {
	INVALID_LOGIN,
	MISSING_CREDENTIALS = 'LOGIN_MISSING_CREDENTIALS',
	USER_DOES_NOT_EXIST = 'LOGIN_USER_DOES_NOT_EXIST',
	INVALID_CREDS = 'LOGIN_INVALID_CREDENTIALS',
	OTHER = 'LOGIN_ERROR',
}

type LoginComponentProps = {
	setUsername: (username: string) => void;
	setPassword: (password: string) => void;
	onClickSubmit: () => void;
	loginError: LoginErrors | null;
	isLoading: boolean;
};

const LoginComponent = (props: LoginComponentProps) => {
	return (
		<>
			<Center style={{ height: '100vh' }}>
				{props.isLoading ? (
					<Center>
						<Loading />
					</Center>
				) : (
					<StyledContainer>
						<Stack>
							<form
								action=''
								method='post'
								onSubmit={e => {
									e.preventDefault();
									props.onClickSubmit();
								}}
							>
								<Text style={{ textAlign: 'center' }}>Log in to Vividly</Text>
								<Space h='md' />
								<TextInput
									onChange={e => props.setUsername(e.target.value)}
									key='username'
									type='text'
									placeholder='username'
									required
									maxLength={20}
								/>
								<Space h='xs' />
								<TextInput
									onChange={e => props.setPassword(e.target.value)}
									key='password'
									type='password'
									placeholder='password'
									required
								/>
								{props.loginError !== null && (
									<>
										<Space h='xs' />
										<Text color='red' ta='center'>
											{props.loginError === LoginErrors.MISSING_CREDENTIALS
												? 'Missing username and/or password. Please try again!'
												: props.loginError === LoginErrors.INVALID_LOGIN
												? 'Username and/or password is incorrect. Please try again!'
												: props.loginError === LoginErrors.USER_DOES_NOT_EXIST
												? `User does not exist. Please register first!`
												: 'Unknown error 😅 - contact help@vividly.love'}
										</Text>
									</>
								)}
								<Space h='md' />
								<Center>
									<Flex
										direction='column'
										sx={{
											textAlign: 'center',
										}}
									>
										<Button color='grape' type='submit'>
											Enter
										</Button>
										<Text>or</Text>
										<Link href='/register'>
											<Button color='grape' variant='light' component='span'>
												Register
											</Button>
										</Link>
									</Flex>
								</Center>
							</form>
						</Stack>
					</StyledContainer>
				)}
			</Center>
		</>
	);
};

const Login: Page = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState<LoginErrors | null>(null);
	const [isPageLoading, setIsPageLoading] = useState(true);

	const router = useRouter();

	const onClickSubmit = () => {
		const tryLogin = async () => {
			try {
				setLoginError(null);
				const res = await makeApiCall<LoginResponse>({
					uri: `/auth/login`,
					method: 'POST',
					body: { username, password },
				});

				if (!res.success && res.error) {
					if (res.error === 'Invalid credentials') {
						setLoginError(LoginErrors.INVALID_LOGIN);
					} else if (res.error === 'Missing credentials') {
						setLoginError(LoginErrors.MISSING_CREDENTIALS);
					} else if (res.error === 'User does not exist') {
						setLoginError(LoginErrors.USER_DOES_NOT_EXIST);
					} else {
						setLoginError(LoginErrors.OTHER);
					}
				} else if (res.success) {
					localStorage.setItem(STORAGE_CUR_USER_KEY, JSON.stringify(res));
					window.location.href = `/profile/${res.user.id}`;
				}
			} catch (e) {
				console.log(e);
			}
		};

		tryLogin();
	};

	useEffect(() => {
		const storedUser = localStorage.getItem(STORAGE_CUR_USER_KEY);
		if (storedUser) {
			const parsedCurUser = JSON.parse(storedUser);
			if (parsedCurUser.token && parsedCurUser.user) {
				router.push(`/profile/${parsedCurUser.user.id}`);
			} else {
				setIsPageLoading(false);
			}
		} else {
			setIsPageLoading(false);
		}
	}, []);

	return (
		<LoginComponent
			setUsername={setUsername}
			setPassword={setPassword}
			onClickSubmit={onClickSubmit}
			loginError={loginError}
			isLoading={isPageLoading}
		/>
	);
};

Login.getLayout = page => <GradientLayout>{page}</GradientLayout>;

export default Login;
