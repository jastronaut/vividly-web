import { Text, Title, Center, Stack, UnstyledButton } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

import { Page } from '../_app';
import GradientLayout from '@/components/layout/GradientLayout';

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
						a: {
							textDecoration: 'underline',
						},
					}}
					align='center'
				>
					{error ? (
						<>
							<Title ta='center'>❌ {errorToMessage(error)}</Title>
							<Text>
								<a href='mailto:supportp@vividly.love'>Contact support</a> if
								you think this is a mistake.
							</Text>
						</>
					) : (
						<>
							<Title>Email verified ✅</Title>
							<UnstyledButton component='a' href='/feed' variant='subtle'>
								Start sharing Vividly 🔮
							</UnstyledButton>
						</>
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

VerificationPage.getLayout = page => <GradientLayout>{page}</GradientLayout>;

export default VerificationPage;
