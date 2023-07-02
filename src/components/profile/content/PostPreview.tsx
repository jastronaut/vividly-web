import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Text } from '@mantine/core';

import { Post, BlockType, Block } from '@/types/post';
import { showAndLogErrorNotification } from '@/showerror';
import { Footer } from '@/components/post/Footer';
import { ImageBlock } from '@/components/post/blocks/blocks';
import { LinkBlockContent } from '@/components/post/blocks/LinkBlockContent';
import { useCurUserContext } from '../../utils/CurUserContext';
import { CommentsModal } from '@/components/post/comments/CommentsModal';
import { makeApiCall } from '@/utils';
import {
	LikesResponse,
	NewCommentResponse,
	DefaultResponse,
} from '@/types/api';
import { DismissWarningModal } from '../../DismissWarningModal';

export const addNewlines = (txt: string, id: string) =>
	txt.length < 1 ? (
		<br key={`${id}-br-1`} />
	) : txt.indexOf('\n') < 0 ? (
		<Text key={`${id}-0`}>{txt}</Text>
	) : (
		txt.split('\n').map((item, index) => (
			<Text key={`${id}-${index}`}>
				{item}
				<br />
			</Text>
		))
	);

const PostContentWrapper = styled.div`
	margin: 0 ${rem(16)};
`;

function renderPostContent(content: Block, key: string) {
	switch (content.type) {
		case BlockType.TEXT:
			return addNewlines(content.text, key);
		case BlockType.IMAGE:
			return (
				<ImageBlock
					key={key}
					url={content.url}
					width={content.width}
					height={content.height}
				/>
			);
		case BlockType.LINK:
			return (
				<LinkBlockContent
					key={key}
					description={content.description}
					imageURL={content.imageURL}
					title={content.title}
					url={content.url}
				/>
			);
		default:
			return <p key={key}>Unknown block type</p>;
	}
}

type Props = {
	post: Post;
	onDeletePost: (id: number) => void;
	isOwnPost: boolean;
};

export const PostPreview = (props: Props) => {
	const { post } = props;
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [comments, setComments] = useState(post.comments);
	const [isLiked, setIsLiked] = useState(post.isLikedByUser);
	const [likeCount, setLikeCount] = useState(post.likes);
	const [likesLoading, setLikesLoading] = useState(false);
	const [commentsDisabled, setCommentsDisabled] = useState(
		post.commentsDisabled
	);
	const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);

	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const tryDeletePost = (id: number) => {
		setDeleteWarningOpen(true);
	};

	const onClickLikeDebug = useCallback(async () => {
		setLikesLoading(true);
		try {
			const resp = await makeApiCall<LikesResponse>({
				uri: `/posts/${post.id}/${isLiked ? 'unlike' : 'like'}`,
				method: 'POST',
				token,
			});

			setIsLiked(!isLiked);
			setLikeCount(resp.likes);
		} catch (err) {
			showAndLogErrorNotification(`Can't like post.id ${post.id}`, err);
		}
		setLikesLoading(false);
	}, [isLiked, post.id, token]);

	const onAddComment = useCallback(
		async (comment: string) => {
			if (comment.length < 1) {
				return;
			}

			const resp = await makeApiCall<NewCommentResponse>({
				uri: `/posts/${post.id}/comment`,
				method: 'POST',
				token,
				body: {
					content: comment,
				},
			});

			if (!resp.success) {
				showAndLogErrorNotification(
					`Can't add comment to post.id=${post.id}`,
					resp.error
				);
				return;
			}

			const newComment = {
				...resp.comment,
				authorId: curUser.user.id,
				author: {
					id: curUser.user.id,
					username: curUser.user.username,
					name: curUser.user.name,
					avatarSrc: curUser.user.avatarSrc,
				},
			};
			setComments(comments => [...comments, newComment]);
		},
		[post.id, curUser, token]
	);

	const onDeleteComment = useCallback(
		async (id: number) => {
			try {
				const res = await makeApiCall<DefaultResponse>({
					uri: `/posts/${post.id}/comment/${id}`,
					method: 'DELETE',
					token,
				});
				setComments(comments => comments.filter(comment => comment.id !== id));
			} catch (err) {
				showAndLogErrorNotification(
					`Can't delete comment.id=${id} from post.id=${post.id}`,
					err
				);
			}
		},
		[post.id, token]
	);

	const toggleDisableComments = useCallback(async () => {
		try {
			const resp = await makeApiCall<DefaultResponse>({
				uri: `/posts/${post.id}/comments/${
					commentsDisabled ? 'enable' : 'disable'
				}`,
				method: 'POST',
				token,
			});
			if (resp.success) setCommentsDisabled(!commentsDisabled);
			else throw new Error('Failed to disable/enable comments');
		} catch (err) {
			showAndLogErrorNotification(
				`Can't disable/enable comments for post.id=${post.id}`,
				err
			);
		}
	}, [post.id, commentsDisabled, token]);

	return (
		<div style={{ marginBottom: '16px' }} id={`${props.post.id}`}>
			<PostContentWrapper>
				{post.content.map((block, index) =>
					renderPostContent(block, index.toString())
				)}
			</PostContentWrapper>

			<DismissWarningModal
				isOpen={deleteWarningOpen}
				onNo={() => setDeleteWarningOpen(false)}
				onYes={() => {
					setDeleteWarningOpen(false);
					props.onDeletePost(post.id);
				}}
				message='Delete this post?'
			/>

			<CommentsModal
				isOpen={commentsOpen}
				onClose={() => setCommentsOpen(false)}
				comments={comments}
				onSubmit={onAddComment}
				onDelete={onDeleteComment}
				isPostAuthor={props.isOwnPost}
				commentsDisabledForFriends={commentsDisabled}
			/>

			<Footer
				commentCount={comments.length}
				timestamp={post.createdTime}
				onClickComment={() => setCommentsOpen(true)}
				likeCount={likeCount}
				isLiked={isLiked}
				onClickLike={likesLoading ? () => null : onClickLikeDebug}
				onDelete={() => tryDeletePost(post.id)}
				isOwnPost={props.isOwnPost}
				commentsDisabled={commentsDisabled}
				toggleDisableComments={toggleDisableComments}
			/>
		</div>
	);
};
