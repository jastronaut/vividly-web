import React from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { GlobalStyle } from './GlobalStyle';

const baseTheme = {
	link: '#00A7FD',
	accent: '#be4bdb',
	green: '#1bb76e',
};

export const LightThemeAdditions = {
	name: 'light',
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
	name: 'dark',
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

export const VividlyThemeProvider = (props: {
	children: React.ReactNode;
	theme: DefaultTheme;
}) => {
	return (
		<>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: props.theme.name === 'light' ? 'light' : 'dark',
					fontFamily: 'Lato, sans-serif',
					headings: { fontFamily: 'Montserrat, sans-serif' },
					white: LightThemeAdditions.background.primary,
					black: darkThemeAdditions.background.primary,
					primaryColor: 'grape',
				}}
			>
				<ThemeProvider theme={props.theme}>
					<>
						<GlobalStyle />
						<Notifications />
						{props.children}
					</>
				</ThemeProvider>
			</MantineProvider>
		</>
	);
};
