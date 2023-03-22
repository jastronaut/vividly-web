import styled from 'styled-components';
import { VividlyThemeProvider, lightTheme } from '../styles/Theme';

type Props = {
	children: React.ReactNode;
};

const MainContent = styled.main``;

export const Layout = ({ children }: Props) => {
	return (
		<VividlyThemeProvider theme={lightTheme}>
			<MainContent>{children}</MainContent>
		</VividlyThemeProvider>
	);
};
