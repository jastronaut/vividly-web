import { useEffect, useState } from 'react';
import { Drawer, Center, Space } from '@mantine/core';
import { rem } from 'polished';
import useSWR from 'swr';

import { Post } from '@/types/post';
import { DefaultResponse, PostResponse } from '@/types/api';
import { fetchWithToken, makeApiCall } from '@/utils';
import { URL_PREFIX } from '@/constants';
import { useCurUserContext } from '@/components/contexts/CurUserContext';
import { PostProvider, usePostContext } from '@/components/post/PostContext';
import { usePostDrawerContext } from '@/components/contexts/PostDrawerContext';

import { Comment } from '@/components/post/comments/Comment';
import { MiniLoader } from '@/components/common/Loading';
import { PostContent } from '../content/PostContent';
import { CommentsSection, PostSection } from './styles';
import { NewCommentInput } from '@/components/post/comments/NewCommentInput';

type PostDrawerContentProps = {
	post: Post;
	curUserId: number;
	token: string;
	onClickQuotePost: (post: Post) => void;
	withQuotePost: boolean;
	onClose: () => void;
};

export const PostPreviewDrawerContent = (props: PostDrawerContentProps) => {
	const { post, likePost, toggleDisableComments, addComment } =
		usePostContext();
	const [commentDraft, setCommentDraft] = useState('');

	const onDelete = async () => {
		try {
			const resp = await makeApiCall<DefaultResponse>({
				uri: `/posts/${post.id}`,
				method: 'DELETE',
				token: props.token,
			});

			if (!resp.success) {
				throw new Error(resp.error);
			}
			props.onClose();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<Space h={rem(14)} />
			<PostSection>
				<PostContent
					post={post}
					onDeletePost={onDelete}
					isOwnPost={props.curUserId === post?.author?.id}
					onClickQuotePost={() => props.onClickQuotePost(post)}
					onClickComments={() => {}}
					withQuotes={props.withQuotePost}
				/>
			</PostSection>
			<CommentsSection>
				{post.comments.map(comment => (
					<Comment
						key={comment.id}
						{...comment}
						onDelete={() => {}}
						canDelete={true}
						onClickLink={() => {}}
					/>
				))}
				<NewCommentInput
					draft={commentDraft}
					setDraft={setCommentDraft}
					onSubmit={addComment}
					disabled={post.commentsDisabled}
					unfocused
				/>
			</CommentsSection>
		</>
	);
};

type PostDrawerProps = {
	onClickQuotePost: (post: Post) => void;
	withQuotePost?: boolean;
	withTitle?: boolean;
};

export const PostDrawer = (props: PostDrawerProps) => {
	const { withQuotePost = true, withTitle = false } = props;
	const { postId, isOpen, closePostId } = usePostDrawerContext();
	const { curUser } = useCurUserContext();

	const { token } = curUser;

	const { data, error, isLoading, mutate } = useSWR<PostResponse>(
		[postId && token ? `${URL_PREFIX}/posts/${postId}` : '', token],
		([url, token]: [string, string]) => fetchWithToken(url, token)
	);

	const onClickQuotePost = (post: Post) => {
		props.onClickQuotePost(post);
		closePostId();
	};

	const onClose = () => {
		mutate(undefined, false);
		closePostId();
	};

	useEffect(() => {
		mutate();
	}, [postId]);

	return (
		<Drawer
			opened={isOpen}
			onClose={onClose}
			position='right'
			title={
				withTitle && curUser.user?.name
					? `${curUser.user.name}'s post`
					: undefined
			}
			overlayProps={{
				opacity: 0.55,
				blur: 3,
			}}
		>
			{isLoading ? (
				<Center
					sx={{
						marginTop: rem(48),
					}}
				>
					<MiniLoader />
				</Center>
			) : !data?.post ? (
				<div> not found</div>
			) : (
				<PostProvider post={data.post} curUser={curUser}>
					<PostPreviewDrawerContent
						post={data.post}
						curUserId={curUser.user.id}
						onClickQuotePost={onClickQuotePost}
						withQuotePost={withQuotePost}
						onClose={onClose}
						token={token}
					/>
				</PostProvider>
			)}
		</Drawer>
	);
};
