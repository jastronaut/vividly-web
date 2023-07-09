import { createContext, useContext, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';

import { Friend } from '@/types/user';
import { FriendsResponse } from '@/types/api';
import { useCurUserContext } from './CurUserContext';
import { uri } from '@/constants';
import { fetchWithToken } from '@/utils';

type FriendsContext = {
	isLoading: boolean;
	friends: Friend[];
	loadMoreFriends: () => void;
	friendsError: any;
	removeFriend: (friendId: number) => void;
	favoriteFriend: (friendId: number) => void;
	refetchFriends: () => void;
};

const FriendsContext = createContext<FriendsContext>({} as FriendsContext);

export const useFriendsContext = () => {
	return useContext(FriendsContext);
};

type Props = {
	children: React.ReactNode;
	id: string;
};

export const FriendsProvider = (props: Props) => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;
	const id = parseInt(props.id);

	const {
		data = [],
		error,
		isLoading,
		size,
		setSize,
		mutate,
	} = useSWRInfinite<FriendsResponse>(
		(pageIndex: number, previousPageData: FriendsResponse | null) => {
			// reached the end
			if (
				!token ||
				(previousPageData &&
					(!previousPageData.data ||
						!previousPageData.data.length ||
						!previousPageData.cursor))
			) {
				return null;
			}

			if (!curUser.user || id !== curUser?.user.id) {
				return null;
			}

			// first page, we don't have `previousPageData`
			if (pageIndex === 0 && !previousPageData)
				return [`${uri}/friends`, token];

			// add the cursor to the API endpoint
			if (previousPageData)
				return [`${uri}/friends?cursor=${previousPageData.cursor}`, token];
			return null;
		},
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ revalidateFirstPage: false, shouldRetryOnError: true }
	);

	const loadMoreFriends = useCallback(() => {
		setSize(size + 1);
	}, [size]);

	const removeFriend = useCallback(
		(friendId: number) => {
			const newFriends = data?.map(d => {
				return {
					...d,
					data: d.data.filter(f => f.friend.id !== friendId),
				};
			});
			mutate(newFriends, false);
		},
		[data, mutate]
	);

	const favoriteFriend = useCallback(
		(friendId: number) => {
			const newFriends = data?.map(d => {
				return {
					...d,
					data: d.data.map(f => {
						if (f.friend.id === friendId) {
							return {
								...f,
								isFavorite: !f.isFavorite,
								friend: {
									...f.friend,
								},
							};
						}
						return f;
					}),
				};
			});
			mutate(newFriends, false);
		},
		[data, mutate]
	);

	const refetchFriends = useCallback(() => {
		mutate();
	}, [mutate]);

	const flattenedData = data?.flatMap(d => d.data);

	return (
		<FriendsContext.Provider
			value={{
				isLoading,
				friends: flattenedData,
				loadMoreFriends,
				friendsError: error,
				removeFriend,
				favoriteFriend,
				refetchFriends,
			}}
		>
			{props.children}
		</FriendsContext.Provider>
	);
};
