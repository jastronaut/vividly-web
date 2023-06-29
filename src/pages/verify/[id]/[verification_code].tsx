import { Title, Center, Button, Stack } from '@mantine/core';

import { Page } from '../../_app';

function errorToMessage(code: string) {
	switch (code) {
		case 'VERIFICATION_CODE_INVALID':
			return 'Invalid verification code.';
		case 'VERIFICATION_CODE_EXPIRED':
			return 'Your verification code has expired.';
		case 'VERIFICATION_EMAIL_ALREADY_VERIFIED':
			return 'Your email has already been verified.';
		default:
			return 'An unknown error occurred.';
	}
}

export const Content = () => {
	const errorCode = 'VERIFICATION_CODE_INVALID';
	const error = 1;

	const errorMessage = errorToMessage(errorCode) + ' :(';
	return (
		<div style={{ height: '100vh' }}>
			<Center sx={{ height: '100%' }}>
				<Stack
					sx={{
						width: '50%',
						'@media (max-width: 800px)': {
							width: '100%',
						},
					}}
					align='center'
				>
					<Title order={2} align='center'>
						{error ? errorMessage : 'Your account has been verified!'}
					</Title>
					{error ? (
						<Button variant='outline' component='a' href='/login' size='md'>
							Login
						</Button>
					) : (
						<Button variant='light' component='a' href='/feed' size='lg'>
							Start sharing Vividly 🔮
						</Button>
					)}
				</Stack>
			</Center>
		</div>
	);
};

const VerificationPage: Page = () => {
	return (
		<>
			<Content />
		</>
	);
};

VerificationPage.getLayout = (page: React.ReactNode) => {
	return <>{page}</>;
};

export default VerificationPage;
