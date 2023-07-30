import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Card } from '@mantine/core';

import { VividlyThemeProvider } from '../styles/Theme';
import { Footer } from '../components/post/Footer';

export default {
	title: 'Post/Footer',
	component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = args => (
	<VividlyThemeProvider>
		<Card
			shadow='sm'
			p='xl'
			radius='md'
			withBorder
			style={{ width: '500px', height: '120px' }}
		>
			<Footer {...args} />
		</Card>
	</VividlyThemeProvider>
);

export const Primary = Template.bind({});

Primary.args = {
	onClickLike: () => {},
	isLiked: false,
	likeCount: 22,
	commentCount: 3,
	onClickComment: () => {},
	timestamp: 1620000000000,
};
