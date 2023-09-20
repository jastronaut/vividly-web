import { createContext, useContext, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import useSWR, { KeyedMutator } from 'swr';

import { UserResponse, ProfileFeedResponse } from '@/types/api';
import { useCurUserContext } from './CurUserContext';
import { uri } from '@/constants';
import { fetchWithToken } from '@/utils';
import { Block } from '@/types/post';

type ProfilePostsContext = {
	isLoading: boolean;
	loadMore: () => void;
	error: any;
	refetchFeed: () => void;
	hasMore: boolean;
	user: UserResponse | undefined;
	userError: any;
	mutatePosts: KeyedMutator<ProfileFeedResponse[]>;
	isUserLoading: boolean;
	isPostsLoading: boolean;
	feed: ProfileFeedResponse[];
	deletePost: (id: number, pageIndex: number) => void;
	updateUser: (user: Partial<UserResponse>) => void;
	addPostFromBlocks: (blocks: Block[]) => void;
	refetchUser: () => void;
	updatePostFromBlocks: (
		blocks: Block[],
		postId: number,
		pageIndex: number
	) => void;
};

const ProfilePostsContext = createContext<ProfilePostsContext>(
	{} as ProfilePostsContext
);

export const useProfileContext = () => {
	return useContext(ProfilePostsContext);
};

type Props = {
	children: React.ReactNode;
	profileId: string;
};

export const ProfileProvider = (props: Props) => {
	const { curUser, updateCurUser } = useCurUserContext();
	const { token } = curUser;
	const { profileId } = props;

	const {
		data: user,
		error: userError,
		isLoading: isUserLoading,
		mutate: mutateUser,
	} = useSWR<UserResponse>(
		[profileId && token ? `${uri}/users/${profileId}` : '', token],
		([url, token]: [string, string]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false, refreshInterval: 15000 }
	);

	// get user's posts
	const {
		data = [],
		error: postsError,
		isLoading: isPostsLoading,
		size: postsSize,
		setSize: setPostsSize,
		mutate: mutatePosts,
	} = useSWRInfinite<ProfileFeedResponse>(
		(pageIndex: number, previousPageData: ProfileFeedResponse | null) => {
			// reached the end
			if (
				!token ||
				(previousPageData &&
					(!previousPageData.data ||
						!previousPageData.data.length ||
						!previousPageData.cursor))
			)
				return null;

			if (!user?.friendship && !(user?.user.id === curUser?.user.id)) {
				return null;
			}
			// first page, we don't have `previousPageData`
			if (pageIndex === 0 && !previousPageData)
				return [`${uri}/feed/uid/${profileId}`, token];

			// add the cursor to the API endpoint
			if (previousPageData)
				return [
					`${uri}/feed/uid/${profileId}?cursor=${previousPageData.cursor}`,
					token,
				];
			return null;
		},
		([url, token]: [string, string]) => fetchWithToken(url, token),
		{ revalidateFirstPage: false, shouldRetryOnError: true }
	);

	const loadMore = useCallback(() => {
		setPostsSize(postsSize + 1);
	}, [postsSize, setPostsSize]);

	const refetchFeed = useCallback(() => {
		mutatePosts(undefined, true);
	}, [mutatePosts]);

	const deletePost = (postId: number, pageIndex: number) => {
		fetch(`${uri}/posts/${postId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(res => res.json())
			.then(resp => {
				mutatePosts(data => {
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
				mutatePosts();
			});
	};

	const updateUserProfile = useCallback(
		(newUser: Partial<UserResponse>) => {
			if (!user) {
				return;
			}

			mutateUser(u => {
				if (!u) {
					return;
				}

				if (curUser.user.id === u.user.id) {
					updateCurUser({
						...u.user,
						...newUser.user,
					});
				}

				return {
					...u,
					...newUser,
				};
			});
		},
		[user, mutateUser]
	);

	const addPostFromBlocks = useCallback(
		async (blocks: Block[]) => {
			const res = await fetch(`${uri}/posts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					content: blocks,
				}),
			});
			const resp = await res.json();

			mutatePosts(currentData => {
				if (currentData && currentData.length) {
					const curFirstPage = currentData[0];
					const newFirstPage = {
						...curFirstPage,
						data: [resp.post, ...curFirstPage.data],
					};
					return [newFirstPage, ...currentData.slice(1)];
				}
				return [resp.post];
			}, false);
		},
		[token, mutatePosts]
	);

	const updatePostFromBlocks = useCallback(
		async (blocks: Block[], postId: number, pageIndex: number) => {
			const res = await fetch(`${uri}/posts/${postId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					content: blocks,
				}),
			});
			const resp = await res.json();

			mutatePosts(
				currentData => {
					if (currentData && currentData.length) {
						return currentData.map((page, index) => {
							if (index === pageIndex) {
								const newPage = {
									...page,
									data: page.data.map(post =>
										post.id === postId
											? {
													...post,
													...resp.post,
													content: blocks,
											  }
											: post
									),
								};
								return newPage;
							}
							return page;
						});
					}
					return currentData;
				},
				{ revalidate: true }
			);
		},
		[token, mutatePosts]
	);

	const refetchUser = useCallback(() => {
		mutateUser(undefined, true);
	}, [mutateUser]);

	const flattenedData = data?.flatMap(d => d.data);
	const lastPage = data?.[data.length - 1];

	return (
		<ProfilePostsContext.Provider
			value={{
				isLoading: isPostsLoading,
				loadMore,
				error: postsError,
				refetchFeed,
				hasMore: !!lastPage?.cursor,
				user,
				userError,
				mutatePosts,
				isUserLoading,
				isPostsLoading,
				feed: data,
				deletePost,
				updateUser: updateUserProfile,
				addPostFromBlocks,
				refetchUser,
				updatePostFromBlocks,
			}}
		>
			{props.children}
		</ProfilePostsContext.Provider>
	);
};
