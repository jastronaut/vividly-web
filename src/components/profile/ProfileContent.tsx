import { Menu } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

import { User } from '@/types/user';
import { Post } from '@/types/post';
import { useCurUserContext } from '@/components/utils/CurUserContext';

import { ProfileHeaderComponent } from './header';
import { PostPreview } from './PostPreview';

type ProfileContentProps = {
	user?: User;
	isUserLoading: boolean;
	posts: Post[];
	isPostsLoading: boolean;
	onClickLike: (id: string, isLiked: boolean) => void;
	onAddComment: (postId: string, comment: string) => void;
	onDeleteComment: (postId: string, commentId: string) => void;
	onDeletePost: (id: string) => void;
	children?: React.ReactNode;
	toggleDisableComments: (id: string, isDisabled: boolean) => void;
};

export const ProfileContent = (props: ProfileContentProps) => {
	const { curUser } = useCurUserContext();
	return (
		<div>
			<ProfileHeaderComponent isLoading={props.isUserLoading} {...props.user} />
			{props.children}
			{props.posts.map(post => (
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
			))}
			{props.isPostsLoading && <div>Loading...</div>}
		</div>
	);
};
