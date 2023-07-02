import { useState, useEffect } from 'react';
import { TextInput, Center, Button, Space, Text, Tooltip } from '@mantine/core';
import Link from 'next/link';

import {
	StyledContainer,
	RegisterContainer,
} from '../../components/register/styles';
import { STORAGE_CUR_USER_KEY } from '../../constants';
import { CurUser } from '@/types/user';
import { showAndLogErrorNotification } from '@/showerror';
import { makeApiCall } from '@/utils';
import LoginLogoutLayout from '@/components/layout/LoginLogoutLayout';
import { Page } from '../_app';

const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const RegisterSteps = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [step, setStep] = useState(0);
	const [userId, setUserId] = useState<number | null>(null);

	const checkUsername = () => {
		// make sure username is valid
		const len = username.length;
		if (len < 3) {
			return setUsernameError(
				'Username is too short. Must be at least 3 characters.'
			);
		}

		if (len > 20) {
			return setUsernameError(
				'Username is too long. Must be at most 20 characters.'
			);
		}

		if (!usernameRegex.test(username)) {
			return setUsernameError(
				'Username can only contain letters, numbers, and underscores.'
			);
		}

		const checkUsername = async () => {
			const res = await makeApiCall<{ exists: boolean }>({
				uri: `/users/username/exists/${username}`,
				method: 'GET',
			});

			if (res.exists) {
				setUsernameError('Username already taken.');
			} else {
				setStep(1);
				setUsernameError(null);
			}
		};

		checkUsername();
	};

	const tryRegister = () => {
		setEmailError(null);
		setPasswordError(null);
		setUsernameError(null);

		if (!email.length) {
			setEmailError('Email is required.');
			return;
		}

		if (!password.length) {
			setPasswordError('Password is required.');
			return;
		}

		if (!username.length) {
			setUsernameError('Username is required.');
			return;
		}

		const checkEmailAndRegister = async () => {
			try {
				const res = await makeApiCall<{ exists: boolean }>({
					uri: `/users/email/exists/${email}`,
					method: 'GET',
				});

				if (res.exists) {
					setEmailError('Email already in use.');
					return;
				}

				setEmailError(null);

				const user = await makeApiCall<CurUser>({
					uri: '/auth/register',
					method: 'POST',
					body: {
						username,
						password,
						email,
					},
				});

				localStorage.setItem(STORAGE_CUR_USER_KEY, JSON.stringify(user));
				setUserId(user.user.id);
			} catch (err) {
				showAndLogErrorNotification(
					`Couldn't register your account, please check your details and try again later!`,
					err
				);
			}
		};

		checkEmailAndRegister();
	};

	useEffect(() => {
		if (!username.length) {
			return;
		}

		if (username.length > 20) {
			setUsernameError('Username is too long. Must be at most 20 characters.');
			return;
		}

		if (!usernameRegex.test(username)) {
			setUsernameError(
				'Username can only contain letters, numbers, and underscores.'
			);
		} else {
			setUsernameError(null);
		}
	}, [username]);

	useEffect(() => {
		if (!password.length) {
			return;
		}

		if (password.length < 6) {
			setPasswordError('Password must be at least 6 characters.');
		} else {
			setPasswordError(null);
		}
	}, [password]);

	useEffect(() => {
		if (userId !== null) {
			window.location.href = '/profile/' + userId;
		}
	}, [userId]);

	return (
		<>
			{step < 2 && (
				<>
					<Text>Join Vividly</Text>
					<Space h='md' />
					<Tooltip
						label='Username can contain letters, numbers, and underscores'
						position='bottom'
						withArrow
					>
						<TextInput
							onChange={e => setUsername(e.target.value)}
							key='username'
							type='username'
							placeholder='username'
							required
							maxLength={20}
							title='Username'
							error={usernameError}
							style={{
								width: '200px',
							}}
						/>
					</Tooltip>
					<Space h='md' />
					{step === 1 && (
						<>
							<TextInput
								onChange={e => setEmail(e.target.value)}
								key='email'
								type='email'
								placeholder='email'
								required
								title='Email'
								error={emailError}
								style={{
									width: '200px',
								}}
							/>
							<Space h='md' />
							<Tooltip
								label='Password must be at least 6 characters'
								position='bottom'
								withArrow
							>
								<TextInput
									onChange={e => setPassword(e.target.value)}
									key='password'
									type='password'
									placeholder='password'
									required
									title='Password'
									error={passwordError}
									minLength={6}
									style={{
										width: '200px',
									}}
								/>
							</Tooltip>
						</>
					)}

					{step === 0 && (
						<Center>
							<Button
								type='submit'
								color='grape'
								radius='lg'
								onClick={checkUsername}
								variant='outline'
							>
								Next
							</Button>
						</Center>
					)}
					{step === 1 && (
						<>
							<Space h='md' />
							<Center>
								<Button
									type='submit'
									color='grape'
									radius='lg'
									onClick={tryRegister}
								>
									Join
								</Button>
							</Center>
						</>
					)}
				</>
			)}
			{step === 2 && (
				<>
					<Text fw={700}>Thanks for joining Vividly!</Text>
					<Text>{`We've sent an email to ${email} to verify your account.`}</Text>
					<Space h='sm' />
					<Link href='/feed'>
						<Button
							variant='gradient'
							gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }}
							radius='lg'
						>{`Let's go!`}</Button>
					</Link>
				</>
			)}
		</>
	);
};

const Register: Page = () => {
	return (
		<form
			style={{ height: '100vh' }}
			onSubmit={e => e.preventDefault()}
			method=''
		>
			<RegisterContainer>
				<StyledContainer>
					<RegisterSteps />
				</StyledContainer>
			</RegisterContainer>
		</form>
	);
};

Register.getLayout = (page: React.ReactNode) => (
	<LoginLogoutLayout>{page}</LoginLogoutLayout>
);

export default Register;
