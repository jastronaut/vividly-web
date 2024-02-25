import { CurUserProvider } from '../contexts/CurUserContext';
import { AccountInfoProvider } from '../contexts/AccountInfoContext';
import { VividlyThemeProvider } from '@/styles/Theme';
import { PageContentContainer } from './navigation/styles';

type Props = {
	children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
	return (
		<CurUserProvider>
			<VividlyThemeProvider>
				<AccountInfoProvider>
					<PageContentContainer>{children}</PageContentContainer>
				</AccountInfoProvider>
			</VividlyThemeProvider>
		</CurUserProvider>
	);
};

export default AdminLayout;
