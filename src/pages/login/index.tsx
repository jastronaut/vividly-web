import { useState, useEffect } from 'react';
import {
	Alert,
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
import { useRouter } from 'next/router';

import { STORAGE_CUR_USER_KEY } from '../../constants';
import { makeApiCall } from '@/utils';
import { LoginResponse } from '@/types/api';

import { Background, GlobalStyle } from '@/components/register/styles';

const StyledContainer = styled.div`
	background-color: ${props => props.theme.background.primary};
	border-radius: ${rem(8)};
	color: ${props => props.theme.text.primary};
	padding: ${rem(16)} ${rem(32)};

	@media screen and (max-width: 800px) {
		width: 80%;
	}
`;

enum LoginErrors {
	OK = 'OK',
	INVALID_LOGIN = 'INVALID_LOGIN',
	MISSING_CREDENTIALS = 'MISSING_CREDENTIALS',
	OTHER = 'OTHER',
}

type LoginComponentProps = {
	setUsername: (username: string) => void;
	setPassword: (password: string) => void;
	onClickSubmit: () => void;
	loginError: LoginErrors;
};

const LoginComponent = (props: LoginComponentProps) => {
	const router = useRouter();
	return (
		<>
			<Center style={{ height: '100vh' }}>
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
							/>
							<Space h='xs' />
							<TextInput
								onChange={e => props.setPassword(e.target.value)}
								key='password'
								type='password'
								placeholder='password'
								required
							/>
							{props.loginError !== LoginErrors.OK && (
								<Alert
									color='red'
									title='❗️ Error'
									radius='lg'
									variant='outline'
								>
									{props.loginError === LoginErrors.MISSING_CREDENTIALS
										? 'Missing credentials'
										: props.loginError === LoginErrors.INVALID_LOGIN
										? 'Invalid login'
										: 'Unknown error 😅'}
								</Alert>
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
									<Button
										color='grape'
										variant='light'
										onClick={() => router.push('/register')}
									>
										Register
									</Button>
								</Flex>
							</Center>
						</form>
					</Stack>
				</StyledContainer>
			</Center>
		</>
	);
};

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState(LoginErrors.OK);
	const [isPageLoading, setIsPageLoading] = useState(true);

	const onClickSubmit = () => {
		const tryLogin = async () => {
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
				} else {
					setLoginError(LoginErrors.OTHER);
				}
			} else if (res.success) {
				console.log(res);
				localStorage.setItem(STORAGE_CUR_USER_KEY, JSON.stringify(res));
				window.location.href = '/profile/' + res.user.id;
			}
		};

		tryLogin();
	};

	useEffect(() => {
		const storedUser = localStorage.getItem(STORAGE_CUR_USER_KEY);
		if (storedUser) {
			const parsedCurUser = JSON.parse(storedUser);
			if (parsedCurUser.token && parsedCurUser.user) {
				window.location.href = '/profile/' + parsedCurUser.user.id;
			} else {
				setIsPageLoading(false);
			}
		} else {
			setIsPageLoading(false);
		}
	}, []);

	return (
		<>
			{isPageLoading ? (
				<div>Loading...</div>
			) : (
				<>
					<GlobalStyle />
					<Background>
						<LoginComponent
							setUsername={setUsername}
							setPassword={setPassword}
							onClickSubmit={onClickSubmit}
							loginError={loginError}
						/>
					</Background>
				</>
			)}
		</>
	);
}
