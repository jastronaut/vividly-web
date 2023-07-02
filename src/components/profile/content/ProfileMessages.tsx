import { Skeleton, Stack, Space, Text } from '@mantine/core';
export const PostsLoading = () => {
	return (
		<Stack>
			<Space h='md' />
			<Skeleton height={20} />
			<Skeleton height={20} />
			<Skeleton height={20} />
			<Skeleton height={20} mt={6} width='70%' />
			<Space h='sm' />
		</Stack>
	);
};

export const EmptyPosts = (props: { children?: React.ReactNode }) => {
	return (
		<Stack>
			<Text align='center' c='dimmed'>
				No posts... yet!
			</Text>
			{props.children}
		</Stack>
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
