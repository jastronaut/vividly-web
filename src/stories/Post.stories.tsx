import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { VividlyThemeProvider } from '../styles/Theme';
import { Content } from '@/components/post/Content';
import { BlockType } from '@/types/post';

export default {
	title: 'Post/Content',
	component: Content,
} as ComponentMeta<typeof Content>;

const Template: ComponentStory<typeof Content> = args => (
	<VividlyThemeProvider>
		<Content {...args} />
	</VividlyThemeProvider>
);

export const Primary = Template.bind({});
Primary.args = {
	postId: 1,
	blocks: [
		{
			type: BlockType.TEXT,
			text: 'this structure sucks',
		},
		{
			type: BlockType.IMAGE,
			url: 'https://i.imgur.com/B0VUfKl.jpg',
			width: 316,
			height: 316,
		},
	],
};

export const Link = Template.bind({});
Link.args = {
	postId: 1,
	blocks: [
		{
			type: BlockType.LINK,
			url: 'https://www.google.com',
			title: 'Google',
			description: 'Search engine',
			imageURL: 'https://i.ibb.co/7CTbH64/google.png',
		},
	],
};
