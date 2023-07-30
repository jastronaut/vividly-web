import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { VividlyThemeProvider } from '../styles/Theme';
import { FeedPreview } from '../components/feed/FeedPreview';
import { BlockType } from '@/types/post';

const now = 1548381600;

const ItemBase = {
	item: {
		id: 1,
		isFavorite: false,
		lastReadPostId: 1,
		lastReadPostTime: now - 1000,
		isUnread: true,

		friend: {
			id: 1,
			name: 'John Doe',
			username: 'johndoe',
			avatarSrc: '',
			bio: 'sample',
		},
	},
};

export default {
	title: 'Feed/Preview',
	component: FeedPreview,
} as ComponentMeta<typeof FeedPreview>;

const Template: ComponentStory<typeof FeedPreview> = args => (
	<VividlyThemeProvider>
		<FeedPreview {...args} />
	</VividlyThemeProvider>
);

export const TextPost = Template.bind({});

TextPost.args = {
	item: {
		...ItemBase.item,
		friend: {
			...ItemBase.item.friend,
			posts: [
				{
					id: 1,
					authorId: 1,
					createdTime: now,
					content: [
						{
							type: BlockType.TEXT,
							text: 'Chuck Norris tells Simon what to do. Chuck Norris has a mug of nails instead of coffee in the morning. Chuck Norris once roundhouse kicked someone so hard that his foot broke the speed of light. Chuck Norris can sit in the corner of a round room. Chuck Norris can divide by zero.',
						},
					],
				},
			],
		},
	},
};

export const ImagePost = Template.bind({});
ImagePost.args = {
	item: {
		...ItemBase.item,
		friend: {
			...ItemBase.item.friend,
			posts: [
				{
					id: 1,
					authorId: 1,
					createdTime: now,
					content: [
						{
							type: BlockType.IMAGE,
							url: 'https://images.unsplash.com/photo-1617129724623-84f1d2fd78f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=621&q=80',
							width: 621,
							height: 414,
						},
					],
				},
			],
		},
	},
};

export const LinkPost = Template.bind({});
LinkPost.args = {
	item: {
		...ItemBase.item,
		friend: {
			...ItemBase.item.friend,
			posts: [
				{
					id: 1,
					authorId: 1,
					createdTime: now,
					content: [
						{
							type: BlockType.LINK,
							url: 'https://www.google.com',
							title: 'Google',
							description: 'Search engine',
						},
					],
				},
			],
		},
	},
};

export const EmptyPost = Template.bind({});
EmptyPost.args = {
	item: ItemBase.item,
};
