import { Skeleton, Stack, Space, Text } from '@mantine/core';
import styled from 'styled-components';

const TextWrapper = styled.div`
	flex: 1;
`;

export const PostsLoading = () => {
	return (
		<Stack spacing='xs'>
			<Space h='md' />
			<Skeleton h={16} />
			<Skeleton h={16} />
			<Skeleton h={16} />
			<Skeleton h={16} mt={6} width='70%' />
			<Space h='md' />
			<Skeleton h={16} />
			<Skeleton h={16} />
			<Skeleton h={16} mt={6} width='70%' />
			<Space h='md' />
		</Stack>
	);
};

export const EmptyPosts = (props: { children?: React.ReactNode }) => {
	return (
		<TextWrapper>
			<Space h='xl' />
			<Text align='center' c='dimmed'>
				No posts... yet!
			</Text>
			{props.children}
			<Space h='md' />
		</TextWrapper>
	);
};

export const PrivateProfileMessage = () => {
	return (
		<Stack>
			<Text align='center' c='dimmed'>
				{`🔒 You need to be friends with this user to view their posts.`}
			</Text>
		</Stack>
	);
};

export const BlockedProfileMessage = () => {
	return (
		<Stack>
			<Space h='xl' />
			<Text align='center' c='dimmed'>
				{`🚫 You have blocked this user.`}
			</Text>
		</Stack>
	);
};
