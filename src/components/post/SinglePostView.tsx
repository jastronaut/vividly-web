import { useEffect, useRef } from 'react';
import { Divider, Space, Title } from '@mantine/core';
import { rem } from 'polished';
import styled from 'styled-components';
import Link from 'next/link';

import { Content } from './Content';
import { Footer } from './Footer';
import { NewCommentInput } from './comments/NewCommentInput';
import { SinglePostViewComments } from './comments/SinglePostViewComments';
import { usePostContext } from './PostContext';
import { useCurUserContext } from '../utils/CurUserContext';

const Wrapper = styled.div`
	padding: ${rem(16)} ${rem(24)};
	margin: ${rem(16)} ${rem(48)};

	@media screen and (max-width: 800px) {
		margin: 0;
		padding: ${rem(8)} ${rem(16)};
	}
`;

export const SinglePostView = () => {
	const { curUser } = useCurUserContext();
	const { post, likePost, toggleDisableComments, addComment } =
		usePostContext();

	const inputRef = useRef<HTMLTextAreaElement>(null);

	const onClickCommentsButton = () => {
		inputRef.current?.focus();
	};

	useEffect(() => {
		console.log(post.comments, 'post');
	}, [post.comments]);

	return (
		<>
			<Title order={5} align='center'>
				<Link href={`/profile/${post.author?.id}`}>{post.author?.name}</Link>
				{`'s post`}
			</Title>
			<Space h='sm' />
			<Divider />
			<Wrapper>
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
				<NewCommentInput
					onSubmit={addComment}
					disabled={post.commentsDisabled && curUser.user.id !== post.authorId}
					inputRef={inputRef}
				/>
				<SinglePostViewComments
					comments={post.comments}
					postAuthorId={post.authorId}
					curUserId={curUser.user.id}
				/>
			</Wrapper>
		</>
	);
};
