import { Analytics } from '@vercel/analytics/react';
import { VividlyThemeProvider } from '../../styles/Theme';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	return (
		<VividlyThemeProvider>
			{children}
			{process.env.NODE_ENV === 'production' && <Analytics />}
		</VividlyThemeProvider>
	);
};
