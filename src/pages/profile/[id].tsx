import React, { useState, useEffect } from 'react';
import { GetStaticPropsContext } from 'next';
import useSWR from 'swr';

import { Page } from '../_app';
import { fetchWithToken } from '../../utils';
import { showAndLogErrorNotification } from '@/showerror';

import { Post, Block } from '@/types/post';
import { LikesResponse } from '@/types/api';

import { ProfileContent } from '@/components/profile/ProfileContent';
import { EditorModal } from '../../components/editor';
import { NewPostButton } from '@/components/profile/NewPostButton';
import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import AppShellLayout from '@/components/AppShellLayout';
import { UserResponse } from '@/types/api';

type PageProps = {
	id: string;
};

const Profile = (props: PageProps) => {
	const { id } = props;
	const [isEditorOpen, setIsEditorOpen] = useState(false);

	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const {
		data: user,
		error: userError,
		isLoading: isUserLoading,
	} = useSWR<UserResponse>(
		[id && token ? `http://localhost:1337/v0/users/${id}` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const {
		data: posts = [],
		error: postsError,
		isLoading: isPostsLoading,
		mutate,
	} = useSWR<Post[]>(
		[id && token ? `http://localhost:1337/v0/feed/uid/${id}` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const onSubmitPost = (blocks: Block[]) => {
		fetch('http://localhost:1337/v0/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				content: blocks,
			}),
		})
			.then(res => res.json())
			.then(resp => {
				mutate(data => {
					if (data) {
						return [resp.post, ...data];
					}
					return [resp.post];
				});
				setIsEditorOpen(false);
			})
			.catch(err => {
				showAndLogErrorNotification('Failed to create post', err);
			});
	};

	const onClickLike = (id: string, isLiked: boolean) => {
		fetch(
			`http://localhost:1337/v0/posts/${id}/${isLiked ? 'unlike' : 'like'}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then(res => res.json())
			.then(resp => {
				const response = resp as LikesResponse;
				mutate(data => {
					if (data) {
						return data.map(post => {
							if (post.id === id) {
								return {
									...post,
									likes: response.likes,
									isLikedByUser: !post.isLikedByUser,
								};
							}
							return post;
						});
					}
					return data;
				});
			})
			.catch(err => {
				showAndLogErrorNotification('Error liking or unliking post', err);
			});
	};

	const onAddComment = (postId: string, comment: string) => {
		fetch(`http://localhost:1337/v0/posts/${postId}/comment`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				content: comment,
			}),
		})
			.then(res => res.json())
			.then(resp => {
				mutate(data => {
					if (data) {
						return data.map(post => {
							if (post.id === postId) {
								return {
									...post,
									comments: [
										{
											...resp.comment,
											author: {
												id: curUser.user.id,
												username: curUser.user.username,
												name: curUser.user.name,
												avatarSrc: curUser.user.avatarSrc,
											},
										},
										...post.comments,
									],
								};
							}
							return post;
						});
					}
					return data;
				});
			})
			.catch(err => {
				showAndLogErrorNotification('Could not add comment', err);
			});
	};

	const onDeleteComment = (postId: string, commentId: string) => {
		fetch(`http://localhost:1337/v0/posts/${postId}/comment/${commentId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(res => res.json())
			.then(resp => {
				mutate(data => {
					if (data) {
						return data.map(post => {
							if (post.id === postId) {
								return {
									...post,
									comments: post.comments.filter(
										comment => comment.id !== commentId
									),
								};
							}
							return post;
						});
					}
					return data;
				});
			})
			.catch(err => {
				showAndLogErrorNotification('Could not delete comment', err);
			});
	};

	const onDeletePost = (postId: string) => {
		fetch(`http://localhost:1337/v0/posts/${postId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(res => res.json())
			.then(resp => {
				mutate(data => {
					if (data) {
						return data.filter(post => post.id !== postId);
					}
					return data;
				});
			})
			.catch(err => {
				showAndLogErrorNotification('Could not delete post', err);
			});
	};

	const toggleDisableComments = (postId: string, isDisabled: boolean) => {
		fetch(
			`http://localhost:1337/v0/posts/${postId}/comments/${
				isDisabled ? 'enable' : 'disable'
			}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then(res => res.json())
			.then(resp => {
				mutate(data => {
					if (data) {
						return data.map(post => {
							if (post.id === postId) {
								return {
									...post,
									commentsDisabled: !post.commentsDisabled,
								};
							}
							return post;
						});
					}
					return data;
				});
			})
			.catch(err => {
				showAndLogErrorNotification('Could not toggle comments', err);
			});
	};

	useEffect(() => {
		if (userError) {
			showAndLogErrorNotification('Error fetching user', userError);
		}
	}, [userError]);

	return (
		<>
			<ProfileContent
				posts={posts}
				user={user ? user.user : user}
				isUserLoading={isUserLoading}
				isPostsLoading={false}
				onClickLike={onClickLike}
				onAddComment={onAddComment}
				onDeleteComment={onDeleteComment}
				onDeletePost={onDeletePost}
				toggleDisableComments={toggleDisableComments}
			>
				{user && user.user.id === curUser.user.id && (
					<>
						<EditorModal
							isOpen={isEditorOpen}
							onClose={() => setIsEditorOpen(false)}
							onChange={val => console.log('printed')}
							onSubmit={onSubmitPost}
						/>
						<NewPostButton
							toggle={() => setIsEditorOpen(true)}
							isOpen={isEditorOpen}
						/>
					</>
				)}
			</ProfileContent>
		</>
	);
};

const ProfilePage: Page<PageProps> = props => {
	const { id } = props;
	const { curUser, isLoading } = useCurUserContext();

	return <>{!curUser.token ? <div>Loading</div> : <Profile id={id} />}</>;
};

ProfilePage.getLayout = page => (
	<AppShellLayout>
		<CurUserProvider>{page}</CurUserProvider>
	</AppShellLayout>
);

export const getStaticProps = (
	context: GetStaticPropsContext<{ id: string }>
) => {
	return {
		props: {
			id: context.params?.id,
		},
	};
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths = () => {
	return { paths: [], fallback: 'blocking' };
};

export default ProfilePage;
