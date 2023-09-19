import { NotificationTabs } from '@/components/activity/notifications/NotificationTabs';
import { Page } from '../_app';
import AppLayout from '@/components/layout/AppLayout';
import { FadeIn } from '@/styles/Animations';
import { PostDrawerProvider } from '@/components/contexts/PostDrawerContext';

const NotificationsPage: Page = () => {
	return (
		<>
			<FadeIn>
				<PostDrawerProvider>
					<NotificationTabs />
				</PostDrawerProvider>
			</FadeIn>
		</>
	);
};

NotificationsPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default NotificationsPage;
