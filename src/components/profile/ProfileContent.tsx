import { Text, Center, Container, Stack, Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

import { User } from '@/types/user';
import { Post } from '@/types/post';
import { FeedResponse as Feed } from '@/types/api';
import { useCurUserContext } from '@/components/utils/CurUserContext';

import { ProfileHeaderComponent } from './header';
import { PostPreview } from './PostPreview';

type ProfileContentProps = {
	user?: User;
	isUserLoading: boolean;
	posts: Post[];
	feed?: Feed[];
	isPostsLoading: boolean;
	onClickLike: (id: string, isLiked: boolean, pageIndex: number) => void;
	onAddComment: (postId: string, comment: string) => void;
	onDeleteComment: (postId: string, commentId: string) => void;
	onDeletePost: (id: string) => void;
	children?: React.ReactNode;
	toggleDisableComments: (id: string, isDisabled: boolean) => void;
	hasMorePosts?: boolean;
	onClickLoadMore?: () => void;
};

export const ProfileContent = (props: ProfileContentProps) => {
	const { curUser } = useCurUserContext();
	const feed: Feed[] = props.feed || [];
	return (
		<div>
			<ProfileHeaderComponent isLoading={props.isUserLoading} {...props.user} />
			{props.children}
			{feed.map((posts, index) =>
				posts.data.map(post => (
					<PostPreview
						key={post.id}
						post={post}
						onClickLike={(id, isLiked) => props.onClickLike(id, isLiked, index)}
						onAddComment={props.onAddComment}
						onDeleteComment={props.onDeleteComment}
						onDeletePost={props.onDeletePost}
						isOwnPost={curUser.user.id === props.user?.id}
						toggleDisableComments={props.toggleDisableComments}
					/>
				))
			)}
			{/*props.posts.map(post => (
				<PostPreview
					key={post.id}
					post={post}
					onClickLike={props.onClickLike}
					onAddComment={props.onAddComment}
					onDeleteComment={props.onDeleteComment}
					onDeletePost={props.onDeletePost}
					isOwnPost={curUser.user.id === props.user?.id}
					toggleDisableComments={props.toggleDisableComments}
				/>
			))*/}
			{!props.isPostsLoading && (
				<Button onClick={props.onClickLoadMore}>Load More</Button>
			)}
			{props.isPostsLoading && <div>Loading...</div>}
			{/* {!props.isPostsLoading && props.posts.length === 0 && (
				<Center style={{ minHeight: '250px' }}>
					<Text>No posts yet!</Text>
				</Center>
			)} */}
		</div>
	);
};
