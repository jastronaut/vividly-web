import { Center, Button, Space } from '@mantine/core';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

import { NotificationTabs } from '@/components/activity/notifications/NotificationTabs';

import { Page } from '../_app';
import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import AppShellLayout from '@/components/layout/AppShellLayout';

const FriendsPage: Page = () => {
	const { curUser, isLoading } = useCurUserContext();

	return (
		<>
			<AppShellLayout id={curUser.user?.id}>
				{!curUser.token || isLoading ? (
					<div>Loading</div>
				) : (
					<>
						<NotificationTabs />
						<Center>
							<Link href='/friend-requests'>
								<Button
									component='a'
									rightIcon={<IconArrowRight />}
									variant='outline'
								>
									Friend requests
								</Button>
							</Link>
						</Center>
					</>
				)}
			</AppShellLayout>
		</>
	);
};

FriendsPage.getLayout = (page: React.ReactNode) => {
	return <CurUserProvider>{page}</CurUserProvider>;
};

export default FriendsPage;
