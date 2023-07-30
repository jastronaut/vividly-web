import { useRouter } from 'next/router';

import { NotificationTabs } from '@/components/activity/notifications/NotificationTabs';
import { Page } from '../_app';
import AppLayout from '@/components/layout/AppLayout';
import { FadeIn } from '@/styles/Animations';

const NotificationsPage: Page = () => {
	const router = useRouter();

	return (
		<>
			<FadeIn>
				<NotificationTabs />
			</FadeIn>
		</>
	);
};

NotificationsPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default NotificationsPage;
