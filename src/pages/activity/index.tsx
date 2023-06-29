import { Center, Button, Space } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useRouter } from 'next/router';

import { NotificationTabs } from '@/components/activity/notifications/NotificationTabs';

import { Page } from '../_app';
import AppLayout from '@/components/layout/AppLayout';

const FriendsPage: Page = () => {
	const router = useRouter();

	return (
		<>
			<NotificationTabs />
			<Center>
				<Button
					component='a'
					href='/friend-requests'
					rightIcon={<IconArrowRight />}
					variant='outline'
				>
					{'Friend requests'}
				</Button>
			</Center>
		</>
	);
};

FriendsPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default FriendsPage;
