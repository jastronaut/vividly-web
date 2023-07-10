import { CurUserProvider } from '../utils/CurUserContext';
import { NotificationsProvider } from '../utils/NotificationsContext';
import { FriendRequestsProvider } from '../utils/FriendRequestsContext';
import NavigationLayout from './navigation/NavigationLayout';

type Props = {
	children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
	return (
		<CurUserProvider>
			<FriendRequestsProvider>
				<NotificationsProvider>
					<NavigationLayout>{children}</NavigationLayout>
				</NotificationsProvider>
			</FriendRequestsProvider>
		</CurUserProvider>
	);
};

export default AppLayout;
