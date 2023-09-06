import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { UnreadBanner } from '../components/profile/content/UnreadBanner';
import { VividlyThemeProvider } from '../styles/Theme';
import { CurUserProvider } from '@/components/contexts/CurUserContext';

export default {
	title: 'Profile/Unread Banner',
	component: UnreadBanner,
} as ComponentMeta<typeof UnreadBanner>;

export const Primary: ComponentStory<typeof UnreadBanner> = args => (
	<VividlyThemeProvider>
		<UnreadBanner {...args} />
	</VividlyThemeProvider>
);

Primary.args = {
	friend: {
		id: 1,
		isFavorite: false,
		lastReadPostId: 1,
		newestPostId: 2,
		lastReadPostTime: '2021-08-01T00:00:00.000Z',
		friend: {
			id: 1,
			username: 'test',
			avatarSrc: 'https://i.imgur.com/B0VUfKl.jpg',
			bio: 'test',
			name: 'test',
		},
	},
};
