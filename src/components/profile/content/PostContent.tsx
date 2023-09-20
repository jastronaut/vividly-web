import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { Post, BlockType, Block } from '@/types/post';
import { makeApiCall } from '@/utils';
import {
	LikesResponse,
	NewCommentResponse,
	DefaultResponse,
} from '@/types/api';

import { showAndLogErrorNotification } from '@/showerror';
import { Footer } from '@/components/post/Footer';
import { ImageBlock } from '@/components/post/blocks/blocks';
import { LinkBlockContent } from '@/components/post/blocks/LinkBlockContent';
import { useCurUserContext } from '../../contexts/CurUserContext';
import { CommentsModal } from '@/components/post/comments/CommentsModal';
import { DismissWarningModal } from '../../common/DismissWarningModal';
import { MusicBlock } from '@/components/post/blocks/MusicBlock';
import { ReportModal, ReportType } from '@/components/common/ReportModal';
import { useProfileContext } from '@/components/contexts/ProfileFeedContext';
import { Linkified } from '@/components/common/Linkified';
import { QuoteBlock } from '@/components/post/blocks/QuoteBlock';
import { EditPostModal } from '@/components/post/EditPostModal';
import { formatPostTime } from '@/components/utils/time';
import { LocationBlock } from '@/components/post/blocks/LocationBlock';

export const addNewlines = (txt: string, id: string) =>
	txt.length < 1 ? (
		<br key={`${id}-br-1`} />
	) : txt.indexOf('\n') < 0 ? (
		<Text key={`${id}-0`}>
			<Linkified>{txt}</Linkified>
		</Text>
	) : (
		txt.split('\n').map((item, index) => (
			<Text key={`${id}-${index}`}>
				<Linkified>{item}</Linkified>
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
		case BlockType.MUSIC:
			return <MusicBlock key={key} {...content} />;
		case BlockType.QUOTE:
			return <QuoteBlock key={key} {...content} />;
		case BlockType.LOCATION:
			return <LocationBlock key={key} {...content} />;
		default:
			return <p key={key}>Unknown block type</p>;
	}
}

type Props = {
	post: Post;
	onDeletePost: (id: number) => void;
	isOwnPost: boolean;
	onClickQuotePost: (post: Post) => void;
	onClickComments?: () => void;
	withQuotes?: boolean;
	onEdit?: () => void;
	pageIndex?: number;
};

export const PostContent = (props: Props) => {
	const {
		post: originalPost,
		onClickComments,
		withQuotes = true,
		pageIndex = 0,
	} = props;
	const [post, setPost] = useState(originalPost);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [comments, setComments] = useState(post.comments);
	const [isLiked, setIsLiked] = useState(post.isLikedByUser);
	const [likeCount, setLikeCount] = useState(post.likes);
	const [likesLoading, setLikesLoading] = useState(false);
	const [commentsDisabled, setCommentsDisabled] = useState(
		post.commentsDisabled
	);
	const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
	const [reportModalOpen, setReportModalOpen] = useState(false);
	const [editPostModalOpen, setEditPostModalOpen] = useState(false);

	const { user } = useProfileContext();

	const { curUser } = useCurUserContext();
	const { token } = curUser;
	const postDraft = editPostModalOpen ? post.content : null;

	const tryDeletePost = (id: number) => {
		setDeleteWarningOpen(true);
	};

	const onClickLikeDebug = useCallback(async () => {
		setLikesLoading(true);
		try {
			setIsLiked(!isLiked);
			const resp = await makeApiCall<LikesResponse>({
				uri: `/posts/${post.id}/${isLiked ? 'unlike' : 'like'}`,
				method: 'POST',
				token,
			});
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
				uri: `/posts/${post.id}/comments-closed`,
				method: 'POST',
				token,
				body: {
					enabled: !commentsDisabled,
				},
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

	const updatePost = (blocks: Block[]) => {
		setPost({
			...post,
			content: blocks,
		});
	};

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

			<EditPostModal
				onSubmit={updatePost}
				isOpen={editPostModalOpen}
				onClose={() => setEditPostModalOpen(false)}
				initialDraft={postDraft}
				createdTime={formatPostTime(post.createdTime)}
				pageIndex={pageIndex}
				postId={post.id}
			/>

			<ReportModal
				isOpen={reportModalOpen}
				onCancel={() => setReportModalOpen(false)}
				onSubmit={() => {
					setReportModalOpen(false);
					notifications.show({
						message: 'Report sent',
					});
				}}
				reportType={ReportType.POST}
				username={user?.user.username || ''}
				userId={user?.user.id || 0}
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
				onClickComment={
					onClickComments ? onClickComments : () => setCommentsOpen(true)
				}
				likeCount={likeCount}
				isLiked={isLiked}
				onClickLike={likesLoading ? () => null : onClickLikeDebug}
				onDelete={() => tryDeletePost(post.id)}
				isOwnPost={props.isOwnPost}
				commentsDisabled={commentsDisabled}
				toggleDisableComments={toggleDisableComments}
				onReport={() => setReportModalOpen(true)}
				onClickQuotePost={() => props.onClickQuotePost(post)}
				withQuotes={withQuotes}
				onEdit={() => setEditPostModalOpen(true)}
			/>
		</div>
	);
};
