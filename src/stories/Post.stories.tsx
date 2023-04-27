import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { VividlyThemeProvider } from '../styles/Theme';
import { Post } from '../components/Post';
import { BlockType } from '@/types/post';

export default {
	title: 'Profile/Post',
	component: Post,
} as ComponentMeta<typeof Post>;

const Template: ComponentStory<typeof Post> = args => (
	<VividlyThemeProvider>
		<Post {...args} />
	</VividlyThemeProvider>
);

export const Primary = Template.bind({});

Primary.args = {
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
		{
			type: BlockType.MUSIC,
			music: {
				spotifyData: {
					album: {
						name: 'Kiss',
					},
					artists: [
						{
							name: 'Carly Rae Jepsen',
						},
					],
					track: {
						id: '1PS4iHR7wHrCvGdjC3XXJj',
						name: 'Turn Me Up',
					},
				},
				title: '🎵 Carly Rae Jepsen - Turn Me Up',
			},
		},
	],
};
