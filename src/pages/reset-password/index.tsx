import { useState, useEffect } from 'react';
import { TextInput, Button, Space, Text } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DefaultResponse } from '@/types/api';
import { CurUser } from '@/types/user';
import { makeApiCall } from '@/utils';
import { STORAGE_CUR_USER_KEY } from '@/constants';
import GradientLayout from '@/components/layout/GradientLayout';
import { Page } from '../_app';
import { StyledContainer, RegisterContainer } from '@/components/auth/styles';

const ResetPassword: Page = () => {
	const [isRequestFinished, setIsRequestFinished] = useState(false);
	const router = useRouter();
	const { userId, code } = router.query;
	const [newPassword1, setNewPassword1] = useState('');
	const [newPassword2, setNewPassword2] = useState('');
	const [error, setError] = useState('');
	const [user, setUser] = useState<CurUser | null>(null);

	useEffect(() => {
		setError('');
		if (newPassword1 !== newPassword2) {
			setError(`Passwords don't match.`);
		}
	}, [newPassword1, newPassword2]);

	const onSubmit = async () => {
		setError('');
		setIsRequestFinished(false);

		if (newPassword1.length < 6) {
			setError(`Password must be at least 6 characters.`);
			return;
		}

		try {
			const res = await makeApiCall<DefaultResponse & CurUser>({
				uri: '/auth/password/reset',
				method: 'POST',
				body: {
					password: newPassword1,
					userId: parseInt(`${userId}`),
					code: code,
				},
			});

			if (res.error || !res.user) {
				if (
					res.errorCode === 'RESET_PASSWORD_INVALID_CODE' ||
					res.errorCode === 'RESET_PASSWORD_CODE_EXPIRED'
				) {
					setError(`This password reset link is invalid. :(`);
					setIsRequestFinished(true);
					return;
				}

				throw null;
			}

			const curUser = {
				user: res.user,
				token: res.token,
			};

			localStorage.setItem(STORAGE_CUR_USER_KEY, JSON.stringify(curUser));
			setUser(curUser);
		} catch (err) {
			setError(`Couldn't change password.`);
		}

		setIsRequestFinished(true);
	};

	useEffect(() => {
		if (!userId || !code) {
			router.push('/404');
		}
	}, [userId, code, router]);

	return (
		<>
			{isRequestFinished && !error && user ? (
				<>
					<Text size='lg' weight={700} ta='center'>
						Password changed successfully!
					</Text>
					<Space h='sm' />
					<Link
						href={{
							pathname: '/profile/[userId]',
							query: { userId: user.user.id },
						}}
					>
						<Button color='grape' radius='lg' size='md'>
							Back to Home
						</Button>
					</Link>
				</>
			) : (
				<>
					<Text size='lg' weight={700} ta='center'>
						Reset your password
					</Text>
					<Space h='sm' />
					<TextInput
						value={newPassword1}
						onChange={e => setNewPassword1(e.currentTarget.value)}
						placeholder='New Password'
						type='password'
						required
						minLength={6}
						width={200}
					/>
					<Space h='xs' />
					<TextInput
						value={newPassword2}
						onChange={e => setNewPassword2(e.currentTarget.value)}
						placeholder='Confirm New Password'
						type='password'
						required
						minLength={6}
					/>
					<Space h='sm' />
					{error && (
						<>
							<Text color='red'>{error}</Text> <Space h='sm' />
						</>
					)}

					<Button
						type='submit'
						color='grape'
						radius='lg'
						onClick={onSubmit}
						size='md'
						disabled={newPassword1.length < 6 || newPassword1 !== newPassword2}
					>
						Submit
					</Button>
				</>
			)}
		</>
	);
};

ResetPassword.getLayout = (page: React.ReactNode) => (
	<GradientLayout>
		<form onSubmit={e => e.preventDefault()} method=''>
			<RegisterContainer>
				<StyledContainer>{page}</StyledContainer>
			</RegisterContainer>
		</form>
	</GradientLayout>
);

export async function getServerSideProps({
	query,
}: {
	query: { userId: string; code: string };
}) {
	return {
		props: {
			query,
		},
	};
}

export default ResetPassword;
