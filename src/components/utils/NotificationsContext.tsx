import { createContext, useContext, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';

import { NotificationsResponse, DefaultResponse } from '@/types/api';
import { useCurUserContext } from './CurUserContext';
import { uri } from '@/constants';
import { fetchWithToken } from '@/utils';
import { Notification } from '@/types/notification';

import { makeApiCall } from '@/utils';

type NotificationsContext = {
	isLoading: boolean;
	notifications: Notification[];
	loadMore: () => void;
	error: any;
	refetch: () => void;
	hasMore: boolean;
	unreadCount: number;
	markNotificationsAsRead: () => void;
};

const NotificationsContext = createContext<NotificationsContext>(
	{} as NotificationsContext
);

export const useNotificationsContext = () => {
	return useContext(NotificationsContext);
};

type Props = {
	children: React.ReactNode;
};

export const NotificationsProvider = (props: Props) => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const {
		data = [],
		error,
		isLoading,
		size,
		setSize,
		mutate,
	} = useSWRInfinite<NotificationsResponse>(
		(pageIndex: number, previousPageData: NotificationsResponse | null) => {
			// reached the end
			if (
				!token ||
				(previousPageData &&
					(!previousPageData.data ||
						!previousPageData.data.notifications.length ||
						!previousPageData.cursor))
			) {
				return null;
			}

			if (!curUser.user) {
				return null;
			}

			// first page, we don't have `previousPageData`
			if (pageIndex === 0 && !previousPageData)
				return [`${uri}/notifications`, token];

			// add the cursor to the API endpoint
			if (previousPageData)
				return [
					`${uri}/notifications?cursor=${previousPageData.cursor}`,
					token,
				];
			return null;
		},
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ revalidateFirstPage: false, shouldRetryOnError: true }
	);

	const markNotificationsAsRead = useCallback(async () => {
		const resp = await makeApiCall<DefaultResponse>({
			uri: `/notifications/read`,
			method: 'POST',
			token,
		});
		if (!resp.success) {
			throw new Error(resp.error);
		}

		mutate();
	}, [token, mutate]);

	const loadMore = useCallback(() => {
		setSize(size + 1);
	}, [size, setSize]);

	const refetch = useCallback(() => {
		mutate();
	}, [mutate]);

	const flattenedData = data?.flatMap(d => d.data.notifications);
	const lastPage = data?.[data.length - 1];

	return (
		<NotificationsContext.Provider
			value={{
				isLoading,
				notifications: flattenedData,
				loadMore,
				error: error,
				refetch,
				hasMore: !!lastPage?.cursor,
				unreadCount: data?.[0]?.data?.unreadCount || 0,
				markNotificationsAsRead,
			}}
		>
			{props.children}
		</NotificationsContext.Provider>
	);
};
