import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { VividlyThemeProvider } from '../styles/Theme';
import { FeedPreview } from '../components/FeedPreview';

export default {
	title: 'Feed/Preview',
	component: FeedPreview,
} as ComponentMeta<typeof FeedPreview>;

const Template: ComponentStory<typeof FeedPreview> = args => (
	<VividlyThemeProvider>
		<FeedPreview {...args} />
	</VividlyThemeProvider>
);

export const Primary = Template.bind({});

Primary.args = {
	displayName: 'John Doe',
	post: {
		content:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nunc, eget ultricies nisl nunc vel nisl. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nunc, eget ultricies nisl nunc vel nisl.',

		timestamp: '1h',
	},
};
