import { Page } from '../_app';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import Link from 'next/link';

import { useEffect } from 'react';
import useSWR from 'swr';

import { URL_PREFIX } from '@/constants';
import { fetchWithToken } from '@/utils';
import { FeedResponse, sortFeedFriendships } from '@/types/feed';
import { showAndLogErrorNotification } from '@/showerror';
import { FeedPreview } from '@/components/feed/FeedPreview';
import AppLayout from '@/components/layout/AppLayout';

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
				<Link
					href={`/profile/${item.friend.id}`}
					key={`link-${item.friend.id}`}
				>
					<FeedPreview item={item} />
				</Link>
			))}
		</>
	);
};

const FeedPage: Page = () => {
	return (
		<>
			<Feed />
		</>
	);
};

FeedPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default FeedPage;
