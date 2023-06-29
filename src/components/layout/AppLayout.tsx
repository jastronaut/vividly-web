import { CurUserProvider } from '../utils/CurUserContext';
import NavigationLayout from './NavigationLayout';

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
