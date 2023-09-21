import { CurUserProvider } from '../contexts/CurUserContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';
import { FriendRequestsProvider } from '../contexts/FriendRequestsContext';
import { FeedProvider } from '../contexts/FeedContext';
import NavigationLayout from './navigation/NavigationLayout';
import { LocalizationProvider } from '../contexts/LocalizationContext';

type Props = {
	children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
	return (
		<CurUserProvider>
			<FeedProvider>
				<FriendRequestsProvider>
					<NotificationsProvider>
						<LocalizationProvider>
							<NavigationLayout>{children}</NavigationLayout>
						</LocalizationProvider>
					</NotificationsProvider>
				</FriendRequestsProvider>
			</FeedProvider>
		</CurUserProvider>
	);
};

export default AppLayout;
