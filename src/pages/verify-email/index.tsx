import { Title, Center, Button, Stack } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

import { Page } from '../_app';

function errorToMessage(code: string) {
	switch (code) {
		case 'verification_code_expired':
			return 'Your verification code has expired ⌛';
		default:
			return 'Invalid verification code :(';
	}
}

export const Content = () => {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');

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
						{error ? errorToMessage(error) : 'Your account has been verified!'}
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
