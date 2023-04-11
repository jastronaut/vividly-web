import { useState, useCallback } from 'react';
import { Post, BlockType, Block, Comment } from '@/types/post';

import { showAndLogErrorNotification } from '@/showerror';
import { Footer } from '@/components/post/Footer';
import { ImageBlock } from '@/components/post/blocks/blocks';
import { LinkBlockContent } from '@/components/post/blocks/LinkBlockContent';

import { useCurUserContext } from '../utils/CurUserContext';
import { CommentsModal } from '@/components/post/comments/CommentsModal';
import { makeApiCall } from '@/utils';
import {
	LikesResponse,
	NewCommentResponse,
	DefaultResponse,
} from '@/types/api';

function renderPostContent(content: Block, key: string) {
	switch (content.type) {
		case BlockType.TEXT:
			return <p key={key}>{content.text}</p>;
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

	const { curUser } = useCurUserContext();
	const { token } = curUser;

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
			try {
				const resp = await makeApiCall<NewCommentResponse>({
					uri: `/posts/${post.id}/comment`,
					method: 'POST',
					token,
					body: {
						content: comment,
					},
				});
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
			} catch (err) {
				showAndLogErrorNotification(
					`Can't add comment to post.id=${post.id}`,
					err
				);
			}
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
		<div>
			{post.content.map((block, index) =>
				renderPostContent(block, index.toString())
			)}

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
				onDelete={() => props.onDeletePost(post.id)}
				isOwnPost={props.isOwnPost}
				commentsDisabled={commentsDisabled}
				toggleDisableComments={toggleDisableComments}
			/>
		</div>
	);
};
