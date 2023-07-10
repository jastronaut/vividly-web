import { createContext, useContext, useCallback } from 'react';
import useSWR from 'swr';

import { FriendRequestsResponse } from '@/types/api';
import { useCurUserContext } from './CurUserContext';
import { uri } from '@/constants';
import { fetchWithToken } from '@/utils';
import { FriendRequest } from '@/types/user';

type FriendRequestsContext = {
	isLoading: boolean;
	inbound: FriendRequest[];
	outbound: FriendRequest[];
	error: any;
	refetch: () => void;
	numRequests: number;
};

const FriendRequestsContext = createContext<FriendRequestsContext>(
	{} as FriendRequestsContext
);

export const useFriendRequestsContext = () => {
	return useContext(FriendRequestsContext);
};

type Props = {
	children: React.ReactNode;
};

export const FriendRequestsProvider = (props: Props) => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const { data, isLoading, error, mutate } = useSWR<FriendRequestsResponse>(
		[token ? `${uri}/friends/requests` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const numRequests = data?.inbound.length || 0;

	const refetch = useCallback(() => {
		mutate();
	}, [mutate]);

	return (
		<FriendRequestsContext.Provider
			value={{
				isLoading,
				outbound: data?.outbound || [],
				inbound: data?.inbound || [],
				error: error,
				refetch,
				// i probably shouldn't do it this way but i am for now
				numRequests,
			}}
		>
			{props.children}
		</FriendRequestsContext.Provider>
	);
};
