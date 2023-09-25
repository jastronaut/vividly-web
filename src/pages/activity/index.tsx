import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useCurUserContext } from '@/components/contexts/CurUserContext';
import { NotificationTabs } from '@/components/activity/notifications/NotificationTabs';
import { Page } from '../_app';
import AppLayout from '@/components/layout/AppLayout';
import { FadeIn } from '@/styles/Animations';
import { PostDrawerProvider } from '@/components/contexts/PostDrawerContext';
import { Loading } from '@/components/common/Loading';

const NotificationsPage: Page = () => {
	const router = useRouter();
	const { isLoading, curUser } = useCurUserContext();

	useEffect(() => {
		if (!isLoading && !curUser.user) {
			router.push('/login');
		}
	}, [curUser, isLoading]);

	if (isLoading || !curUser || !curUser.user) {
		return <Loading />;
	}
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
