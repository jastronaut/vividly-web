import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { VividlyThemeProvider } from '../styles/Theme';
import { PostDrawer } from '@/components/profile/PostDrawer/PostDrawer';

export default {
	title: 'Profile/Post Preview Drawer',
	component: PostDrawer,
} as ComponentMeta<typeof PostDrawer>;

const Template: ComponentStory<typeof PostDrawer> = args => (
	<VividlyThemeProvider>
		<PostDrawer {...args} />
	</VividlyThemeProvider>
);

export const Primary = Template.bind({});
