import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GetStaticPropsContext } from 'next';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useRouter } from 'next/router';

import { Page } from '../_app';
import { fetchWithToken } from '../../utils';
import { showAndLogErrorNotification } from '@/showerror';

import { uri } from '@/constants';
import { Block } from '@/types/post';

import { ProfileContent } from '@/components/profile/ProfileContent';
import { EditorModal } from '../../components/editor';
import { NewPostButton } from '@/components/profile/NewPostButton';
import { Loading } from '@/components/utils/Loading';
import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import AppShellLayout from '@/components/layout/AppShellLayout';
import { UserResponse, ProfileFeedResponse } from '@/types/api';

type PageProps = {
	id: string;
};

const Profile = (props: PageProps) => {
	const { id } = props;
	const [isEditorOpen, setIsEditorOpen] = useState(false);

	const { curUser, updateCurUser } = useCurUserContext();
	const { token } = curUser;

	const router = useRouter();

	const [initLoad, setInitLoad] = useState(true);
	const chatEndRef = useRef<HTMLDivElement>(null);

	const {
		data: user,
		error: userError,
		isLoading: isUserLoading,
		mutate: mutateUser,
	} = useSWR<UserResponse>(
		[id && token ? `${uri}/users/${id}` : '', token],
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
	} = useSWRInfinite<ProfileFeedResponse>(
		(pageIndex: number, previousPageData: ProfileFeedResponse | null) => {
			// reached the end
			if (
				!token ||
				!id ||
				(previousPageData &&
					(!previousPageData.data ||
						!previousPageData.data.length ||
						!previousPageData.cursor))
			)
				return null;
			// first page, we don't have `previousPageData`
			if (pageIndex === 0 && !previousPageData)
				return [`${uri}/feed/uid/${id}`, token];

			// add the cursor to the API endpoint
			if (previousPageData)
				return [
					`${uri}feed/uid/${id}?cursor=${previousPageData.cursor}`,
					token,
				];
			return null;
		},
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ revalidateFirstPage: false, shouldRetryOnError: false }
	);

	const lastPage = data.length > 0 ? data[data.length - 1] : null;
	const hasMorePosts = lastPage ? !!lastPage.cursor : false;

	const onSubmitPost = (blocks: Block[]) => {
		setInitLoad(false);
		fetch(`${uri}/posts`, {
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
					if (data && data.length) {
						const curFirstPage = data[0];
						const newFirstPage = {
							...curFirstPage,
							data: [resp.post, ...curFirstPage.data],
						};
						return [newFirstPage, ...data.slice(1)];
					}
					return [resp.post];
				});
				setIsEditorOpen(false);
			})
			.catch(err => {
				showAndLogErrorNotification('Failed to create post', err);
			});
		setInitLoad(true);
	};

	const onDeletePost = (postId: number, pageIndex: number) => {
		fetch(`${uri}/posts/${postId}`, {
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
						const newData = [...data];
						const thisPage = newData[pageIndex];
						const thisPost = thisPage.data.find(post => post.id === postId);
						if (thisPost) {
							thisPage.data = thisPage.data.filter(post => post.id !== postId);
							return newData;
						}
					}
					return data;
				}, false);
				mutate();
			})
			.catch(err => {
				showAndLogErrorNotification('Could not delete post', err);
			});
	};

	const updateUserProfile = useCallback(
		(newUser: UserResponse) => {
			if (!user) {
				return;
			}

			mutateUser({
				...user,
				...newUser,
			});

			if (curUser.user.id === newUser.user.id) {
				updateCurUser(newUser.user);
			}
		},
		[user]
	);

	const refetchFeed = useCallback(() => {
		mutate(undefined, true);
	}, [mutate]);

	useEffect(() => {
		if (user?.user.id === curUser.user.id) {
			updateCurUser(user.user);
		}
	}, [user]);

	const loadMore = React.useCallback(() => {
		setSize(size + 1);
	}, [setSize, size]);

	useEffect(() => {
		if (userError && !isUserLoading && !user) {
			router.push('/404');
		}

		if (userError) {
			console.log({ userError });
			showAndLogErrorNotification('Error fetching user', userError);
		}
	}, [userError]);

	// useEffect(() => {
	// 	setInitLoad(false);
	// }, [data]);

	// useEffect(() => {
	// 	return () => {
	// 		setIsEditorOpen(false);
	// 		setInitLoad(true);
	// 	};
	// }, []);

	// useEffect(() => {
	// 	// if (containerRef.current) {
	// 	// 	containerRef.current.scrollTop = containerRef.current.scrollHeight;
	// 	// }
	// 	// scroll to bottom of page
	// 	if (chatEndRef.current) {
	// 		chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
	// 	}
	// }, []);
	return (
		<>
			<ProfileContent
				// initLoad={initLoad}
				user={user}
				isUserLoading={isUserLoading}
				isPostsLoading={isPostsLoading}
				onDeletePost={onDeletePost}
				onClickLoadMore={loadMore}
				hasMorePosts={hasMorePosts}
				feed={data}
				updateUserProfileInfo={updateUserProfile}
				openEditor={() => setIsEditorOpen(true)}
				refetchFeed={refetchFeed}
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
							isVisible={isEditorOpen}
						/>
					</>
				)}
			</ProfileContent>
			{/* {initLoad && <div ref={chatEndRef} />} */}
		</>
	);
};

const ProfilePage: Page<PageProps> = props => {
	const { id } = props;
	const { curUser, isLoading } = useCurUserContext();

	return (
		<>
			<AppShellLayout id={curUser?.user?.id}>
				{!curUser.token || isLoading ? <Loading /> : <Profile id={id} />}
			</AppShellLayout>
		</>
	);
};

ProfilePage.getLayout = page => <CurUserProvider>{page}</CurUserProvider>;

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
