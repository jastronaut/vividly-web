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
import GradientLayout from '@/components/layout/GradientLayout';
import { Page } from '../_app';

const usernameRegex = /^[a-zA-Z0-9_]+$/;

const Register: Page = () => {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [resetEmailRequested, setResetEmailRequested] = useState(false);

	const onClickSubmit = async () => {
		if (username.length === 0 && email.length === 0) {
			showAndLogErrorNotification('Please enter a username or email.');
			return;
		}
		setResetEmailRequested(true);
	};

	return (
		<form onSubmit={e => e.preventDefault()} method=''>
			<RegisterContainer>
				<StyledContainer>
					{resetEmailRequested}
					<Text size='lg' weight={700}>
						Forgot Password?
					</Text>
					<Text>Enter your username or email:</Text>
					<Space h={8} />
					<TextInput
						onChange={e => setUsername(e.target.value)}
						key='username'
						type='text'
						placeholder='username'
						required
						title='Username'
						size='md'
						disabled={email.length > 0}
					/>
					<Space h={4} />
					<Text c='dimmed'>or</Text>
					<Space h={4} />
					<TextInput
						onChange={e => setEmail(e.target.value)}
						key='email'
						type='email'
						placeholder='email'
						required
						title='Email'
						size='md'
						disabled={username.length > 0}
					/>

					<Space h={16} />

					<Button
						color='grape'
						size='md'
						type='submit'
						disabled={username.length === 0 && email.length === 0}
						onClick={onClickSubmit}
					>
						Submit
					</Button>
				</StyledContainer>
			</RegisterContainer>
		</form>
	);
};

Register.getLayout = (page: React.ReactNode) => (
	<GradientLayout>{page}</GradientLayout>
);

export default Register;
