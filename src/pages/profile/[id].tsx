import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GetStaticPropsContext } from 'next';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

import { Page } from '../_app';
import { fetchWithToken } from '../../utils';
import { showAndLogErrorNotification } from '@/showerror';

import { uri } from '@/constants';
import { Post, Block } from '@/types/post';
import { LikesResponse } from '@/types/api';

import { ProfileContent } from '@/components/profile/ProfileContent';
import { EditorModal } from '../../components/editor';
import { NewPostButton } from '@/components/profile/NewPostButton';
import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import AppShellLayout from '@/components/layout/AppShellLayout';
import { UserResponse, FeedResponse } from '@/types/api';

type PageProps = {
	id: string;
};

const Profile = (props: PageProps) => {
	const { id } = props;
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [cursor, setCursor] = useState<string | null>('');

	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const getKey = (pageIndex: number, previousPageData: FeedResponse | null) => {
		// reached the end
		if (
			previousPageData &&
			(!previousPageData.data.length || !previousPageData.cursor)
		)
			return null;
		// first page, we don't have `previousPageData`
		if (pageIndex === 0 && !previousPageData)
			return [`${uri}feed/uid/${id}`, token];

		// add the cursor to the API endpoint
		console.log('here');
		console.log('the next cursor is', previousPageData?.cursor);
		if (previousPageData)
			return [`${uri}feed/uid/${id}?cursor=${previousPageData.cursor}`, token];
		console.log('oops');
		return null;
	};

	const {
		data: user,
		error: userError,
		isLoading: isUserLoading,
	} = useSWR<UserResponse>(
		[id && token ? `${uri}users/${id}` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const {
		data = [],
		error: postsError,
		isLoading: isPostsLoading,
		size,
		setSize,
		mutate,
	} = useSWRInfinite<FeedResponse>(
		(pageIndex, previousPageData) => getKey(pageIndex, previousPageData),
		([url, token]) => fetchWithToken(url, token),
		{ parallel: true }
	);

	const onSubmitPost = (blocks: Block[]) => {
		/*
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
			*/
	};

	const onClickLike = (id: string, isLiked: boolean, pageIndex: number) => {
		fetch(`${uri}posts/${id}/${isLiked ? 'unlike' : 'like'}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(res => res.json())
			.then(resp => {
				const response = resp as LikesResponse;
				mutate(data => {
					// if (data) {
					// 	return data.map(post => {
					// 		if (post.id === id) {
					// 			return {
					// 				...post,
					// 				likes: response.likes,
					// 				isLikedByUser: !post.isLikedByUser,
					// 			};
					// 		}
					// 		return post;
					// 	});
					// }
					if (data) {
						const thisPage = data[pageIndex];
						const thisPost = thisPage.data.find(post => post.id === id);
						if (thisPost) {
							thisPost.likes = response.likes;
							thisPost.isLikedByUser = !thisPost.isLikedByUser;
						}
					}
					return data;
				});
			})
			.catch(err => {
				showAndLogErrorNotification('Error liking or unliking post', err);
			});
	};

	const onAddComment = (postId: string, comment: string) => {
		/*
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
			*/
	};

	const onDeleteComment = (postId: string, commentId: string) => {
		/*
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
			*/
	};

	const onDeletePost = (postId: string) => {
		/*
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
			*/
	};

	const toggleDisableComments = (postId: string, isDisabled: boolean) => {
		/*
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
			*/
	};

	// const onClickLoadMore = useCallback(() => {
	// 	let cursor = null;
	// 	if (!posts || posts.length === 0) {
	// 		cursor = null;
	// 		setCursor(null);
	// 	} else {
	// 		const lastPost = posts[posts.length - 1];
	// 		if (lastPost) {
	// 			cursor = lastPost.id;
	// 			setCursor(lastPost.id.toString());
	// 		}
	// 	}
	// }, [posts]);

	useEffect(() => {
		if (userError) {
			showAndLogErrorNotification('Error fetching user', userError);
		}
	}, [userError]);

	console.log(data);

	return (
		<>
			<ProfileContent
				// posts={posts}
				posts={[]}
				user={user ? user.user : user}
				isUserLoading={isUserLoading}
				isPostsLoading={false}
				onClickLike={onClickLike}
				onAddComment={onAddComment}
				onDeleteComment={onDeleteComment}
				onDeletePost={onDeletePost}
				toggleDisableComments={toggleDisableComments}
				onClickLoadMore={() => {
					console.log('wat');
					console.log('=====');
					console.log(data);
					console.log('=====');
					setSize(size + 1);
				}}
				hasMorePosts={cursor !== null}
				feed={data}
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
	<CurUserProvider>
		<AppShellLayout>{page}</AppShellLayout>
	</CurUserProvider>
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
