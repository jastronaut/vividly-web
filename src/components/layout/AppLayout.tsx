import { CurUserProvider } from '../utils/CurUserContext';
import AppShellLayout from './AppShellLayout';

type Props = {
	children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
	return (
		<CurUserProvider>
			<AppShellLayout>{children}</AppShellLayout>
		</CurUserProvider>
	);
};

export default AppLayout;
