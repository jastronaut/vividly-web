import React, { useEffect, createContext, useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { MantineProvider, useMantineTheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import { GlobalStyle } from './GlobalStyle';
import {
	STORAGE_ACCENT_COLOR,
	STORAGE_SYSTEM_THEME,
	STORAGE_THEME_KEY,
} from '@/constants';

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

export const COLORS = [
	'red',
	'pink',
	'grape',
	'violet',
	'indigo',
	'blue',
	'cyan',
	'teal',
	'green',
	'lime',
	'yellow',
	'orange',
];

type VividlyThemeContextType = {
	theme: 'light' | 'dark';
	setTheme: (theme: ThemeName) => void;
	useSystemTheme: boolean;
	setUseSystemTheme: (_useSystemTheme: boolean) => void;
	accentColor: string;
	setAccentColor: (_accentColor: string) => void;
};

export const VividlyThemeContext = createContext<VividlyThemeContextType>({
	theme: ThemeName.Light,
	setTheme: (_theme: ThemeName) => {},
	useSystemTheme: false,
	setUseSystemTheme: (_useSystemTheme: boolean) => {},
	accentColor: 'grape',
	setAccentColor: (_accentColor: string) => {},
});

export const useVividlyTheme = () => useContext(VividlyThemeContext);

export const VividlyThemeProvider = (props: { children: React.ReactNode }) => {
	const [theme, setTheme] = useLocalStorage({
		key: STORAGE_THEME_KEY,
		defaultValue: ThemeName.Light,
	});

	const [useSystemTheme, setUseSystemTheme] = useLocalStorage({
		key: STORAGE_SYSTEM_THEME,
		defaultValue: false,
	});

	const [accentColor, setAccentColor] = useLocalStorage({
		key: STORAGE_ACCENT_COLOR,
		defaultValue: 'grape',
	});

	const [mounted, setMounted] = useState(false);
	const mantineTheme = useMantineTheme();

	const mantineAccentColor =
		mantineTheme.colors[accentColor][theme === ThemeName.Dark ? 8 : 6];

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
				accentColor,
				setAccentColor,
			}}
		>
			<MantineTheme theme={theme} color={accentColor}>
				<ThemeProvider
					theme={
						theme === ThemeName.Dark
							? {
									...darkTheme,
									accent: mantineAccentColor,
							  }
							: { ...lightTheme, accent: mantineAccentColor }
					}
				>
					<GlobalStyle />
					<Notifications />
					{props.children}
				</ThemeProvider>
			</MantineTheme>
		</VividlyThemeContext.Provider>
	);

	if (!mounted) {
		return <div style={{ visibility: 'hidden' }}>{body}</div>;
	}

	return body;
};

type MantineThemeProps = {
	children: React.ReactNode;
	theme: ThemeName;
	color: string;
};

const MantineTheme = (props: MantineThemeProps) => {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: props.theme,
				fontFamily: 'Lato, sans-serif',
				headings: { fontFamily: 'Montserrat, sans-serif' },
				white: LightThemeAdditions.background.primary,
				black: darkThemeAdditions.background.primary,
				primaryColor: props.color,
				components: {
					Button: {
						defaultProps: {
							radius: 'lg',
							color: props.color,
						},
					},
					TextInput: {
						defaultProps: {
							radius: 'md',
						},
					},
				},
			}}
		>
			<ModalsProvider>{props.children}</ModalsProvider>
		</MantineProvider>
	);
};
