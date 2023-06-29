import React, { useEffect, createContext, useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';

import { GlobalStyle } from './GlobalStyle';
import { STORAGE_THEME_KEY } from '@/constants';

export enum ThemeName {
	Light = 'light',
	Dark = 'dark',
}

const baseTheme = {
	link: '#00A7FD',
	accent: '#be4bdb',
	green: '#1bb76e',
};

export const LightThemeAdditions = {
	name: ThemeName.Light,
	text: {
		primary: '#333333',
		muted: '#696969',
		lightest: '#aaaaaa',
	},
	background: {
		primary: '#ffffff',
		secondary: '#E7E8EC',
		hover: '#f8f9fa',
		accented: '#FCF0E7',
	},
	border: {
		primary: '#555',
		secondary: '#ddd',
	},
};

export const lightTheme = {
	...LightThemeAdditions,
	...baseTheme,
};

const darkThemeAdditions = {
	name: ThemeName.Dark,
	text: {
		primary: '#C1C2C5',
		muted: '#cccc',
		lightest: '#aaaaaa',
	},
	background: {
		primary: '#25262b',
		secondary: '#262628',
		hover: '#cacaca50',
		accented: '#000000',
	},
	border: {
		primary: '#1f2024',
		secondary: '#2C2E33',
	},
};

export const darkTheme = {
	...darkThemeAdditions,
	...baseTheme,
};

type VividlyThemeContextType = {
	theme: ThemeName;
	setTheme: (theme: ThemeName) => void;
	useSystemTheme: boolean;
	setUseSystemTheme: (_useSystemTheme: boolean) => void;
};

export const VividlyThemeContext = createContext<VividlyThemeContextType>({
	theme: ThemeName.Light,
	setTheme: (theme: ThemeName) => {},
	useSystemTheme: false,
	setUseSystemTheme: (_useSystemTheme: boolean) => {},
});

export const useVividlyTheme = () => useContext(VividlyThemeContext);

export const VividlyThemeProvider = (props: { children: React.ReactNode }) => {
	const [theme, setTheme] = useLocalStorage({
		key: STORAGE_THEME_KEY,
		defaultValue: 'light' as ThemeName,
	});

	const [useSystemTheme, setUseSystemTheme] = useLocalStorage({
		key: 'useSystemTheme',
		defaultValue: false,
	});

	const [mounted, setMounted] = useState(false);

	const checkPrefersColorScheme = () => {
		if (!window.matchMedia) return;

		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			setTheme(ThemeName.Dark);
		} else {
			setTheme(ThemeName.Light);
		}
	};

	useEffect(() => {
		setMounted(true);
		if (useSystemTheme) {
			checkPrefersColorScheme();
		}
	}, []);

	const body = (
		<VividlyThemeContext.Provider
			value={{
				theme,
				setTheme,
				useSystemTheme,
				setUseSystemTheme,
			}}
		>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: theme,
					fontFamily: 'Lato, sans-serif',
					headings: { fontFamily: 'Montserrat, sans-serif' },
					white: LightThemeAdditions.background.primary,
					black: darkThemeAdditions.background.primary,
					primaryColor: 'grape',
					components: {
						Button: {
							defaultProps: {
								radius: 'lg',
								color: 'grape',
							},
						},
						TextInput: {
							defaultProps: {
								radius: 'md',
							},
						},
						Avatar: {
							defaultProps: {
								radius: 'xl',
							},
						},
					},
				}}
			>
				<ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
					<>
						<GlobalStyle />
						<Notifications />
						{props.children}
					</>
				</ThemeProvider>
			</MantineProvider>
		</VividlyThemeContext.Provider>
	);

	if (!mounted) {
		return <div style={{ visibility: 'hidden' }}>{body}</div>;
	}

	return body;
};
