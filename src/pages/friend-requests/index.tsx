import { FriendRequestTabs } from '@/components/activity/requests/FriendRequestTabs';

import { Page } from '../_app';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import AppLayout from '@/components/layout/AppLayout';

const FriendsPage: Page = () => {
	const { curUser, isLoading } = useCurUserContext();

	return (
		<>
			{!curUser.token || isLoading ? (
				<div>Loading</div>
			) : (
				<>
					<FriendRequestTabs />
				</>
			)}
		</>
	);
};

FriendsPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default FriendsPage;
