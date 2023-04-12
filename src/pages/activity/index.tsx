import { FriendRequestTabs } from '@/components/activity/requests/FriendRequestTabs';
import { NotificationTabs } from '@/components/activity/notifications/NotificationTabs';

import { Page } from '../_app';
import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import AppShellLayout from '@/components/layout/AppShellLayout';

const FriendsPage: Page = props => {
	const { curUser, isLoading } = useCurUserContext();

	return (
		<>
			<AppShellLayout id={curUser.user?.id}>
				{!curUser.token ? (
					<div>Loading</div>
				) : (
					<>
						<NotificationTabs />
						<FriendRequestTabs />
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
