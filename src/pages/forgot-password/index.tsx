import { useState } from 'react';
import { TextInput, Button, Space, Text } from '@mantine/core';
import Link from 'next/link';

import { RegisterContainer, StyledContainer } from '@/components/auth/styles';
import { makeApiCall } from '@/utils';
import GradientLayout from '@/components/layout/GradientLayout';
import { Page } from '../_app';

const ForgotPassword: Page = () => {
	const [email, setEmail] = useState('');
	const [resetEmailRequested, setResetEmailRequested] = useState(false);

	const onClickSubmit = async () => {
		await makeApiCall<{ exists: boolean }>({
			uri: `/auth/password/reset-request`,
			method: 'POST',
			body: {
				email,
			},
		});
		setResetEmailRequested(true);
	};

	return (
		<form onSubmit={e => e.preventDefault()} method=''>
			<RegisterContainer>
				<StyledContainer>
					{resetEmailRequested ? (
						<>
							<Text>
								An email has been sent with a link to reset your password.
							</Text>
							<Text>Thanks for your patience! 💜</Text>
						</>
					) : (
						<>
							<Text size='lg' weight={700}>
								Forgot Password?
							</Text>
							<Text>Enter your account email</Text>
							<Space h={8} />

							<TextInput
								onChange={e => setEmail(e.target.value)}
								key='email'
								type='email'
								placeholder='email'
								required
								title='Email'
								size='md'
							/>

							<Space h={16} />

							<Button
								color='grape'
								size='md'
								type='submit'
								disabled={email.length === 0}
								onClick={onClickSubmit}
							>
								Submit
							</Button>
						</>
					)}
					<Space h={16} />
					<Text>Need more help?</Text>
					<Text>
						<Link
							title='Send an email for additional assitance'
							href='mailto:help@vividly.love?subject=Help%20Resetting%20Password%20or%20Account'
							style={{
								textDecoration: 'underline',
							}}
						>
							Email help@vividly.love
						</Link>
					</Text>
				</StyledContainer>
			</RegisterContainer>
		</form>
	);
};

ForgotPassword.getLayout = (page: React.ReactNode) => (
	<GradientLayout>{page}</GradientLayout>
);

export default ForgotPassword;
