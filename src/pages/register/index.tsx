import { useState, useEffect } from 'react';
import { TextInput, Center, Button, Space, Text, Tooltip } from '@mantine/core';
import Link from 'next/link';

import {
	Background,
	GlobalStyle,
	StyledContainer,
	RegisterContainer,
} from './components/styles';
import { STORAGE_CUR_USER_KEY, uri } from '../../constants';
import { CurUser } from '@/types/user';
import { showAndLogErrorNotification } from '@/showerror';

const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const RegisterSteps = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [step, setStep] = useState(0);

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

		fetch(`${uri}users/username/exists/${username}`, {
			method: 'GET',
		})
			.then(res => res.json())
			.then(data => {
				if (data.exists) {
					setUsernameError('Username already taken.');
				} else {
					setStep(1);
					setUsernameError(null);
				}
			});
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

		// check if email in use
		fetch(`${uri}users/email/exists/${email}`, {
			method: 'GET',
		})
			.then(res => res.json())
			.then(data => {
				if (data.exists) {
					setEmailError('Email already in use.');
				} else {
					// register user
					fetch(uri + '/auth/register', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							username,
							password,
							email,
						}),
					})
						.then(res => res.json())
						.then(data => {
							const user = data as CurUser;
							localStorage.setItem(STORAGE_CUR_USER_KEY, JSON.stringify(user));
						})
						.catch(err => {
							showAndLogErrorNotification(
								`Couldn't register your account, please check your details and try again later!`,
								err
							);
						});
				}
			})
			.catch(err => {
				showAndLogErrorNotification(`Email already in use.`, err);
			});
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

export default function Register() {
	return (
		<div>
			<GlobalStyle />
			<Background>
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
			</Background>
		</div>
	);
}
