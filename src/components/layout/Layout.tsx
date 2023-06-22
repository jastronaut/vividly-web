import { VividlyThemeProvider } from '../../styles/Theme';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	return <VividlyThemeProvider>{children}</VividlyThemeProvider>;
};
