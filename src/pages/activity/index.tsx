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
