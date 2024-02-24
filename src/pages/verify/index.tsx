import Link from 'next/link';
import { Text, Title, Center, Stack, Button } from '@mantine/core';

import { Page } from '../_app';
import GradientLayout from '@/components/layout/GradientLayout';
import { makeApiCall } from '@/utils';
import { DefaultResponse } from '@/types/api';

function errorToMessage(code: string) {
	switch (code) {
		case 'verification_code_expired':
			return 'Your verification code has expired ⌛';
		default:
			return 'Invalid verification code :(';
	}
}

const VerificationPage: Page<{ error: string | null; userId: number }> = ({
	error = null,
	userId,
}) => {
	return (
		<>
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
									<a href='mailto:support@vividly.love?subject=Help%20Verify%20Email'>
										Contact support
									</a>{' '}
									if you think this is a mistake.
								</Text>
							</>
						) : (
							<>
								<Title>Email verified ✅</Title>
								<Link
									href={{
										pathname: '/profile/[id]',
										query: { id: userId },
									}}
								>
									<Button component='span' color='grape' variant='white'>
										Start sharing Vividly 🔮
									</Button>
								</Link>
							</>
						)}
					</Stack>
				</Center>
			</div>
		</>
	);
};

VerificationPage.getLayout = page => <GradientLayout>{page}</GradientLayout>;

export async function getServerSideProps({
	query,
}: {
	query: { userId: string; code: string };
}) {
	const id = parseInt(query.userId);
	try {
		const res = await makeApiCall<DefaultResponse>({
			method: 'POST',
			uri: '/auth/verify-email',
			body: {
				userId: id,
				code: query.code,
			},
		});

		if (res.error) {
			return {
				props: {
					userId: 0,
					error: res.errorCode,
				},
			};
		}
	} catch (err) {
		return {
			props: {
				userId: 0,
				error: 'unknown',
			},
		};
	}

	return {
		props: {
			userId: id,
			error: null,
		},
	};
}

export default VerificationPage;
