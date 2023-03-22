import { useState } from 'react';
import {
	Alert,
	Stack,
	TextInput,
	Center,
	Button,
	Space,
	Text,
	Container,
} from '@mantine/core';

import { STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from '../../constants';

enum RegisterErrors {
	OK = 'OK',
	EMAIL_TAKEN = 'EMAIL_TAKEN',
	USERNAME_TAKEN = 'USERNAME_TAKEN',
	MISSING_CREDENTIALS = 'MISSING_CREDENTIALS',
	OTHER = 'OTHER',
}

type RegisterComponentProps = {
	setUsername: (username: string) => void;
	setPassword: (password: string) => void;
	setEmail: (password: string) => void;
	onClickSubmit: () => void;
	registerError: RegisterErrors;
};

export const RegisterComponent = (props: RegisterComponentProps) => {
	return (
		<>
			<Container>
				<Center style={{ height: '100vh' }}>
					<Stack>
						<Text>Join vividly</Text>
						<TextInput
							onChange={e => props.setEmail(e.target.value)}
							key='email'
							type='text'
							placeholder='email'
							required
						/>
						<TextInput
							onChange={e => props.setUsername(e.target.value)}
							key='username'
							type='text'
							placeholder='username'
							required
						/>
						<TextInput
							onChange={e => props.setPassword(e.target.value)}
							key='password'
							type='password'
							placeholder='password'
							required
						/>

						{props.registerError !== RegisterErrors.OK && (
							<Alert
								color='red'
								title='❗️ Error'
								radius='lg'
								variant='outline'
							>
								{props.registerError === RegisterErrors.EMAIL_TAKEN
									? 'Email already taken'
									: props.registerError === RegisterErrors.USERNAME_TAKEN
									? 'Username already taken'
									: props.registerError === RegisterErrors.MISSING_CREDENTIALS
									? 'Missing credentials'
									: 'Unknown error 😅'}
							</Alert>
						)}

						<Space h='md' />
						<Center>
							<Button color='green' size='xs' onClick={props.onClickSubmit}>
								Create account
							</Button>
						</Center>
					</Stack>
				</Center>
			</Container>
		</>
	);
};

export default function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [error, setError] = useState<RegisterErrors>(RegisterErrors.OK);

	const onClickSubmit = async () => {
		const res = await fetch('/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},

			body: JSON.stringify({
				username: username,
				password: password,
				email: email,
			}),

			credentials: 'include',
		});

		const data = await res.json();

		if (data.error) {
			if (data.error === 'EMAIL_TAKEN') {
				setError(RegisterErrors.EMAIL_TAKEN);
			} else if (data.error === 'USERNAME_TAKEN') {
				setError(RegisterErrors.USERNAME_TAKEN);
			} else if (data.error === 'MISSING_CREDENTIALS') {
				setError(RegisterErrors.MISSING_CREDENTIALS);
			} else {
				setError(RegisterErrors.OTHER);
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
			<RegisterComponent
				setUsername={setUsername}
				setPassword={setPassword}
				setEmail={setEmail}
				onClickSubmit={onClickSubmit}
				registerError={error}
			/>
		</>
	);
}
