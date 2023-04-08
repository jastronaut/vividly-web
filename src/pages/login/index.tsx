import { useState, useEffect } from 'react';
import {
	Alert,
	Stack,
	TextInput,
	Center,
	Button,
	Space,
	Text,
} from '@mantine/core';

import { STORAGE_CUR_USER_KEY, uri } from '../../constants';

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
	return (
		<>
			<Center style={{ height: '100vh' }}>
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
							<Button color='violet' size='xs' type='submit'>
								Enter
							</Button>
						</Center>
					</form>
				</Stack>
			</Center>
		</>
	);
};

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState(LoginErrors.OK);
	const [isPageLoading, setIsPageLoading] = useState(true);

	const onClickSubmit = async () => {
		const res = await fetch(`${uri}auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		});

		const data = await res.json();
		if (data.error) {
			if (data.error === 'invalid login') {
				setLoginError(LoginErrors.INVALID_LOGIN);
			} else if (data.error === 'missing credentials') {
				setLoginError(LoginErrors.MISSING_CREDENTIALS);
			} else {
				setLoginError(LoginErrors.OTHER);
			}
			return;
		}

		localStorage.setItem(STORAGE_CUR_USER_KEY, JSON.stringify(data));
		window.location.href = '/profile/' + data.user.id;
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
				<LoginComponent
					setUsername={setUsername}
					setPassword={setPassword}
					onClickSubmit={onClickSubmit}
					loginError={loginError}
				/>
			)}
		</>
	);
}
