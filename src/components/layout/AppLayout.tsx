import { CurUserProvider } from '../utils/CurUserContext';
import NavigationLayout from './navigation/NavigationLayout';

type Props = {
	children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
	return (
		<CurUserProvider>
			<NavigationLayout>{children}</NavigationLayout>
		</CurUserProvider>
	);
};

export default AppLayout;
