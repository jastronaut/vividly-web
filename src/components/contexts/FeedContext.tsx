import { createContext, useContext, useCallback } from 'react';
import useSWR from 'swr';

import { useCurUserContext } from './CurUserContext';
import { fetchWithToken } from '@/utils';
import { URL_PREFIX } from '@/constants';
import { FeedResponse, FeedFriendship } from '@/types/feed';

type FeedContext = {
	isLoading: boolean;
	feed: FeedFriendship[];
	error: any;
	refetch: () => void;
	unreadFeed: FeedFriendship[];
};

const FeedContext = createContext<FeedContext>({} as FeedContext);

export const useFeedContext = () => {
	return useContext(FeedContext);
};

type Props = {
	children: React.ReactNode;
};

export const FeedProvider = (props: Props) => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const { data, error, isLoading, mutate } = useSWR<FeedResponse>(
		[token ? `${URL_PREFIX}/feed/friends` : '', token],
		([url, token]: [string, string]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const refetch = useCallback(() => {
		mutate();
	}, [mutate]);

	// sort feed friendships
	const feed = data ? data.data : [];

	const unreadFeed = feed.filter(friendship => friendship.isUnread);

	return (
		<FeedContext.Provider
			value={{
				isLoading,
				error: error,
				refetch,
				feed,
				unreadFeed,
			}}
		>
			{props.children}
		</FeedContext.Provider>
	);
};
