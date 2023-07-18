import { useEffect, useRef, useCallback } from 'react';
import { Divider, Space, Title, HoverCard, Group } from '@mantine/core';
import { rem } from 'polished';
import styled from 'styled-components';
import Link from 'next/link';

import { Content } from './Content';
import { Footer } from './Footer';
import { NewCommentInput } from './comments/NewCommentInput';
import { SinglePostViewComments } from './comments/SinglePostViewComments';
import { usePostContext } from './PostContext';
import { useCurUserContext } from '../utils/CurUserContext';
import { Avatar } from '../Avatar';
import { DEFAULT_AVATAR } from '@/constants';

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

	const onClickComment = useCallback(
		(name: string) => {
			if (!inputRef.current) return;
			// add @name to the comment input
			inputRef.current.focus();
			inputRef.current.value = inputRef.current.value + ` @${name} `;
		},
		[inputRef.current]
	);

	useEffect(() => {
		console.log(post.comments, 'post');
	}, [post.comments]);

	return (
		<>
			<Space h='sm' />
			<HoverCard shadow='md' withArrow>
				<HoverCard.Target>
					<Title order={5} align='center'>
						<Link href={`/profile/${post.author?.id}`}>
							{post.author?.name}
						</Link>
						{`'s post`}
					</Title>
				</HoverCard.Target>
				<HoverCard.Dropdown>
					<Group>
						<Avatar
							src={post.author?.avatarSrc || DEFAULT_AVATAR}
							size={35}
							alt={'Profile picture'}
						/>
						<Link href={`/profile/${post.author?.id}`}>
							@{post.author?.username}
						</Link>
					</Group>
				</HoverCard.Dropdown>
			</HoverCard>
			<Space h='sm' />
			<Divider variant='dashed' />
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
					isOwnPost={curUser.user.id === post.authorId}
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
					onClickCommentByUsername={onClickComment}
				/>
			</Wrapper>
		</>
	);
};
