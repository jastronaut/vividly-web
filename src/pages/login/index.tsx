import { useState } from 'react';
import {
	Alert,
	Stack,
	TextInput,
	Center,
	Button,
	Space,
	Text,
} from '@mantine/core';

import { STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from '../../constants';

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
					<Text>Log in to Vividly</Text>
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
						<Alert color='red' title='❗️ Error' radius='lg' variant='outline'>
							{props.loginError === LoginErrors.MISSING_CREDENTIALS
								? 'Missing credentials'
								: props.loginError === LoginErrors.INVALID_LOGIN
								? 'Invalid login'
								: 'Unknown error 😅'}
						</Alert>
					)}
					<Space h='md' />
					<Center>
						<Button color='green' size='xs' onClick={props.onClickSubmit}>
							Enter
						</Button>
					</Center>
				</Stack>
			</Center>
		</>
	);
};

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState(LoginErrors.OK);

	const onClickSubmit = async () => {
		const res = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},

			body: JSON.stringify({
				username: username,
				password: password,
			}),

			credentials: 'include',
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
			console.log(data.error);
			return;
		}

		if (data.data && data.data.streams[0]) {
			localStorage.setItem(STORAGE_TOKEN_KEY, data.data.streams[0].token);
			localStorage.setItem(
				STORAGE_USER_KEY,
				JSON.stringify(data.data.streams[0])
			);
			window.location.href = '/feed';
		}

		console.log(data);
	};

	return (
		<>
			<LoginComponent
				setUsername={setUsername}
				setPassword={setPassword}
				onClickSubmit={onClickSubmit}
				loginError={loginError}
			/>
		</>
	);
}
