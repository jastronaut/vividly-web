import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ProfileHeaderComponent } from '../components/header';
import { VividlyThemeProvider, lightTheme } from '../styles/Theme';

export default {
	title: 'Profile/Header',
	component: ProfileHeaderComponent,
} as ComponentMeta<typeof ProfileHeaderComponent>;

export const Primary: ComponentStory<typeof ProfileHeaderComponent> = args => (
	<VividlyThemeProvider theme={lightTheme}>
		<ProfileHeaderComponent {...args} />
	</VividlyThemeProvider>
);
