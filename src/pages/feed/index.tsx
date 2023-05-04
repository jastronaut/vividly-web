import { Page } from '../_app';
import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import AppShellLayout from '@/components/layout/AppShellLayout';

import { useEffect } from 'react';
import useSWR from 'swr';

import { URL_PREFIX } from '@/constants';
import { fetchWithToken } from '@/utils';
import { FeedResponse, sortFeedFriendships } from '@/types/feed';
import { showAndLogErrorNotification } from '@/showerror';
import { FeedItem } from '@/components/feed/FeedItem';

export const Feed = () => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const { data, error, isLoading, mutate } = useSWR<FeedResponse>(
		[`${URL_PREFIX}/feed/friends`, token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	useEffect(() => {
		if (error) {
			showAndLogErrorNotification(`Couldn't load feed.`, error);
		}
	}, [error]);

	if (isLoading) {
		return <>Loading</>;
	}

	if (!data) {
		return <>No data</>;
	}

	const items = sortFeedFriendships(data.data);

	return (
		<>
			{items.map(item => (
				<FeedItem key={item.id} item={item} />
			))}
		</>
	);
};

const FeedPage: Page = () => {
	const { curUser, isLoading } = useCurUserContext();

	return (
		<>
			<AppShellLayout id={curUser.user?.id}>
				{!curUser.token || isLoading ? (
					<div>Loading</div>
				) : (
					<>
						<Feed />
					</>
				)}
			</AppShellLayout>
		</>
	);
};

FeedPage.getLayout = (page: React.ReactNode) => {
	return <CurUserProvider>{page}</CurUserProvider>;
};

export default FeedPage;
