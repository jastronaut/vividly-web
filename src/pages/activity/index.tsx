import { Center, Button } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useRouter } from 'next/router';

import { NotificationTabs } from '@/components/activity/notifications/NotificationTabs';
import { Page } from '../_app';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';

const FriendsPage: Page = () => {
	const router = useRouter();

	return (
		<>
			<NotificationTabs />
			<Center>
				<Link href='/friend-requests'>
					<Button
						component='span'
						rightIcon={<IconArrowRight />}
						variant='outline'
					>
						{'Friend requests'}
					</Button>
				</Link>
			</Center>
		</>
	);
};

FriendsPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default FriendsPage;
