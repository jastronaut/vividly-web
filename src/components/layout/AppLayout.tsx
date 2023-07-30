import { CurUserProvider } from '../utils/CurUserContext';
import { NotificationsProvider } from '../utils/NotificationsContext';
import { FriendRequestsProvider } from '../utils/FriendRequestsContext';
import { FeedProvider } from '../utils/FeedContext';
import NavigationLayout from './navigation/NavigationLayout';

type Props = {
	children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
	return (
		<CurUserProvider>
			<FeedProvider>
				<FriendRequestsProvider>
					<NotificationsProvider>
						<NavigationLayout>{children}</NavigationLayout>
					</NotificationsProvider>
				</FriendRequestsProvider>
			</FeedProvider>
		</CurUserProvider>
	);
};

export default AppLayout;
