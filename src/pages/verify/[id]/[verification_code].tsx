import { Title, Center, Button, Stack } from '@mantine/core';

import { Page } from '../../_app';

function errorToMessage(code: string) {
	switch (code) {
		case 'VERIFICATION_CODE_INVALID':
			return 'Invalid verification code.';
		default:
			return 'An unknown error occurred.';
	}
}

export const Feed = () => {
	const errorCode = '';
	const error = null;

	const errorMessage = errorToMessage(errorCode);
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
					<Button variant='light' component='a' href='/feed' size='lg'>
						Start sharing Vividly 🔮
					</Button>
				</Stack>
			</Center>
		</div>
	);
};

const VerificationPage: Page = () => {
	return (
		<>
			<Feed />
		</>
	);
};

VerificationPage.getLayout = (page: React.ReactNode) => {
	return <>{page}</>;
};

export default VerificationPage;
