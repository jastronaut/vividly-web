import { createContext, useContext, useState, useCallback } from 'react';

import { Post } from '@/types/post';
import { makeApiCall } from '@/utils';
import {
	LikesResponse,
	NewCommentResponse,
	DefaultResponse,
} from '@/types/api';
import { CurUser } from '@/types/user';
import { showAndLogErrorNotification } from '@/showerror';

type PostContext = {
	isLoading: boolean;
	post: Post;
	addComment: (comment: string) => void;
	likePost: () => void;
	deleteComment: (commentId: string) => void;
	toggleDisableComments: () => void;
};

const PostContext = createContext<PostContext>({} as PostContext);

export const usePostContext = () => {
	return useContext(PostContext);
};

type Props = {
	children: React.ReactNode;
	post: Post;
	curUser: CurUser;
};

export const PostProvider = (props: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [post, setPost] = useState<Post>(props.post);

	const { curUser } = props;
	const { token } = curUser;

	const likePost = useCallback(async () => {
		try {
			const resp = await makeApiCall<LikesResponse>({
				uri: `/posts/${post.id}/${post.isLikedByUser ? 'unlike' : 'like'}`,
				method: 'POST',
				token,
			});

			setPost(post => {
				return {
					...post,
					isLikedByUser: !post.isLikedByUser,
					likes: resp.likes,
				};
			});
		} catch (err) {
			showAndLogErrorNotification(`Can't like post.id ${post.id}`, err);
		}
	}, [post, token]);

	const addComment = useCallback(
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
				setPost(post => {
					return {
						...post,
						comments: [...post.comments, newComment],
					};
				});
			} catch (err) {
				showAndLogErrorNotification(
					`Can't add comment to post.id=${post.id}`,
					err
				);
			}
		},
		[post.id, curUser, token]
	);

	const deleteComment = useCallback(
		async (id: string) => {
			try {
				const res = await makeApiCall<DefaultResponse>({
					uri: `/posts/${post.id}/comment/${id}`,
					method: 'DELETE',
					token,
				});
				setPost(post => {
					return {
						...post,
						comments: post.comments.filter(comment => comment.id !== id),
					};
				});
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
					post.commentsDisabled ? 'enable' : 'disable'
				}`,
				method: 'POST',
				token,
			});
			if (resp.success) {
				setPost(post => {
					return {
						...post,
						commentsDisabled: !post.commentsDisabled,
					};
				});
			} else throw new Error('Failed to disable/enable comments');
		} catch (err) {
			showAndLogErrorNotification(
				`Can't disable/enable comments for post.id=${post.id}`,
				err
			);
		}
	}, [post, token]);

	return (
		<PostContext.Provider
			value={{
				isLoading,
				post,
				addComment,
				likePost,
				deleteComment,
				toggleDisableComments,
			}}
		>
			{props.children}
		</PostContext.Provider>
	);
};
