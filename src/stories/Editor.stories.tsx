import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { EditorWithActions } from '../components/editor/Editor';
import { VividlyThemeProvider } from '../styles/Theme';
import { BlockType } from '@/types/editor';

export default {
	title: 'Editor',
	component: EditorWithActions,
} as ComponentMeta<typeof EditorWithActions>;

const Template: ComponentStory<typeof EditorWithActions> = args => (
	<VividlyThemeProvider>
		<EditorWithActions {...args} />
	</VividlyThemeProvider>
);

export const Primary = Template.bind({});

const emptyChildren = {
	children: [{ text: '' }],
};

Primary.args = {
	initialValue: [
		{
			type: BlockType.TEXT,
			children: [{ text: 'A line of text in a paragraph.' }],
		},
		{
			type: BlockType.IMAGE,
			url: 'https://images.unsplash.com/photo-1592924728350-f7d4fd5d1655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=414&q=80',
			width: 414,
			height: 276,
			...emptyChildren,
		},
		{
			type: BlockType.TEXT,
			children: [{ text: '2 A line of text in a paragraph.' }],
		},
		{
			type: BlockType.IMAGE,
			url: 'https://images.unsplash.com/photo-1617129724623-84f1d2fd78f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=621&q=80',
			...emptyChildren,
			width: 621,
			height: 414,
		},
		{
			type: BlockType.LINK,
			url: 'https://www.google.com',
			title: 'Google',
			description: 'Search engine',
			...emptyChildren,
		},
	],
};
