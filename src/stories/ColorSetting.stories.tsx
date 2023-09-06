import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { ColorSetting } from '../components/settings/ColorSetting';
import { VividlyThemeProvider } from '../styles/Theme';

export default {
	title: 'Settings/Color',
	component: ColorSetting,
} as ComponentMeta<typeof ColorSetting>;

export const Primary = () => (
	<VividlyThemeProvider>
		<ColorSetting />
	</VividlyThemeProvider>
);
