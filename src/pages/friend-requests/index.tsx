import { FriendRequestTabs } from '@/components/activity/requests/FriendRequestTabs';

import { Page } from '../_app';
import AppLayout from '@/components/layout/AppLayout';
import { FadeIn } from '@/styles/Animations';

const FriendsPage: Page = () => {
	return (
		<FadeIn>
			<FriendRequestTabs />
		</FadeIn>
	);
};

FriendsPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default FriendsPage;
