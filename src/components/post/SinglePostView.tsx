import { useRef } from 'react';
import { Divider, Space, Affix } from '@mantine/core';
import { rem } from 'polished';

import { Content } from './Content';
import { Footer } from './Footer';
import { NewCommentInput } from './comments/NewCommentInput';
import { SinglePostViewComments } from './comments/SinglePostViewComments';
import { usePostContext } from './PostContext';
import { useCurUserContext } from '../utils/CurUserContext';

export const SinglePostView = () => {
	const { curUser } = useCurUserContext();
	const { post, likePost, toggleDisableComments, addComment } =
		usePostContext();

	const inputRef = useRef<HTMLTextAreaElement>(null);

	const onClickCommentsButton = () => {
		inputRef.current?.focus();
	};

	return (
		<>
			<Content blocks={post.content} postId={post.id} />
			<Footer
				onClickLike={likePost}
				onClickComment={onClickCommentsButton}
				onDelete={() => {}}
				isLiked={post.isLikedByUser}
				timestamp={post.createdTime}
				toggleDisableComments={toggleDisableComments}
				commentsDisabled={post.commentsDisabled}
				likeCount={post.likes}
				commentCount={post.comments.length}
				isOwnPost={true}
			/>
			<Space h='lg' />
			<Divider />
			<Space h='lg' />
			<SinglePostViewComments
				comments={post.comments}
				postAuthorId={post.authorId}
				curUserId={curUser.user.id}
				commentAuthorId={post.comments[0].authorId}
			/>

			<Affix
				position={{ bottom: 0, right: 0 }}
				sx={{ padding: rem(16), zIndex: 50, width: '80%' }}
			>
				<NewCommentInput
					onSubmit={addComment}
					disabled={post.commentsDisabled && curUser.user.id !== post.authorId}
					inputRef={inputRef}
				/>
			</Affix>
		</>
	);
};
