import { CurUserProvider } from '../contexts/CurUserContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';
import { FriendRequestsProvider } from '../contexts/FriendRequestsContext';
import { FeedProvider } from '../contexts/FeedContext';
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
