import styled from 'styled-components';
import {
	VividlyThemeProvider,
	lightTheme,
	darkTheme,
} from '../../styles/Theme';

type Props = {
	children: React.ReactNode;
};

const MainContent = styled.main``;

export const Layout = ({ children }: Props) => {
	return (
		<VividlyThemeProvider>
			<MainContent>{children}</MainContent>
		</VividlyThemeProvider>
	);
};
