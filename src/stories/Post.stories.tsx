import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';

import { VividlyThemeProvider } from '../styles/Theme';
import { Content } from '@/components/post/Content';
import { BlockType } from '@/types/post';

const Container = styled.div`
	width: 500px;
`;

export default {
	title: 'Post/Content',
	component: Content,
} as ComponentMeta<typeof Content>;

const Template: ComponentStory<typeof Content> = args => (
	<VividlyThemeProvider>
		<Container>
			<Content {...args} />
		</Container>
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

export const Quote = Template.bind({});
Quote.args = {
	postId: 1,
	blocks: [
		{
			type: BlockType.TEXT,
			text: 'THis is a post with a quote',
		},
		{
			type: BlockType.QUOTE,
			postId: 1,
			preview: {
				text: 'this structure sucks',
				type: BlockType.TEXT,
			},
		},
		{
			type: BlockType.TEXT,
			text: 'this is a quote with an image',
		},
		{
			type: BlockType.QUOTE,
			postId: 2,
			preview: {
				type: BlockType.IMAGE,
				url: 'https://i.ibb.co/VB59sXg/tumblr-6fd7d116487deb0728a32ab5f1dfe2cc-97082ed6-500.jpg',
				width: 316,
				height: 316,
			},
		},
	],
};
