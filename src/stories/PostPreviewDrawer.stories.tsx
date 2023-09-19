import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { VividlyThemeProvider } from '../styles/Theme';
import { PostPreviewDrawer } from '@/components/profile/PostDrawer/PostDrawer';

export default {
	title: 'Profile/Post Preview Drawer',
	component: PostPreviewDrawer,
} as ComponentMeta<typeof PostPreviewDrawer>;

const Template: ComponentStory<typeof PostPreviewDrawer> = args => (
	<VividlyThemeProvider>
		<PostPreviewDrawer {...args} />
	</VividlyThemeProvider>
);

export const Primary = Template.bind({});

Primary.args = {
	id: 4,
	isOpen: true,
	close: () => {},
};
