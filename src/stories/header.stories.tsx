import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ProfileHeaderComponent } from '../components/profile/header/header';
import { VividlyThemeProvider } from '../styles/Theme';

export default {
	title: 'Profile/Header',
	component: ProfileHeaderComponent,
} as ComponentMeta<typeof ProfileHeaderComponent>;

export const Primary: ComponentStory<typeof ProfileHeaderComponent> = args => (
	<VividlyThemeProvider>
		<ProfileHeaderComponent {...args} />
	</VividlyThemeProvider>
);
