import { Page } from '../_app';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import Link from 'next/link';
import styled from 'styled-components';
import { rem } from 'polished';
import { IconMoodPlus, IconPencil } from '@tabler/icons-react';
import { Text, Button } from '@mantine/core';

import { useEffect } from 'react';
import useSWR from 'swr';

import { URL_PREFIX } from '@/constants';
import { fetchWithToken } from '@/utils';
import { FeedResponse, sortFeedFriendships } from '@/types/feed';
import { showAndLogErrorNotification } from '@/showerror';
import { FeedPreview } from '@/components/feed/FeedPreview';
import AppLayout from '@/components/layout/AppLayout';
import { FadeIn } from '@/styles/Animations';
import { FeedPreviewLoading } from '@/components/feed/FeedPreview';

const ContentWrapper = styled.div`
	padding: ${rem(24)};
	border: 1px solid ${props => props.theme.background.secondary};
	border-top: none;

	@media screen and (max-width: 500px) {
		padding: ${rem(8)} ${rem(12)};
	}
`;

const EmptyStateWrapper = styled.div`
	margin: ${rem(300)} ${rem(100)} ${rem(100)};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const EmptyState = (props: { id: number }) => {
	return (
		<EmptyStateWrapper>
			<Link href='/friend-requests'>
				<Button leftIcon={<IconMoodPlus />} component='span'>
					Add some friends
				</Button>
			</Link>
			<Text ta='center'>or</Text>
			<Link href={`/profile/${props.id}`}>
				<Button leftIcon={<IconPencil />}>Create a post</Button>
			</Link>
		</EmptyStateWrapper>
	);
};

const LoadingState = () => {
	return (
		<>
			<FeedPreviewLoading />
			<FeedPreviewLoading />
			<FeedPreviewLoading />
			<FeedPreviewLoading />
			<FeedPreviewLoading />
			<FeedPreviewLoading />
		</>
	);
};

export const FeedPage: Page = () => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const { data, error, isLoading, mutate } = useSWR<FeedResponse>(
		[token ? `${URL_PREFIX}/feed/friends` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	useEffect(() => {
		if (error) {
			showAndLogErrorNotification(`Couldn't load feed.`, error);
		}
	}, [error]);

	const items = data ? sortFeedFriendships(data.data) : [];

	const showLoadingState = isLoading || !curUser;

	return (
		<>
			<FadeIn>
				{showLoadingState && <LoadingState />}
				{items.map(item => (
					<Link
						href={`/profile/${item.friend.id}`}
						key={`link-${item.friend.id}`}
					>
						<FeedPreview item={item} />
					</Link>
				))}
				{items.length < 1 && !showLoadingState ? (
					<EmptyState id={curUser.user.id} />
				) : null}
			</FadeIn>
		</>
	);
};

FeedPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default FeedPage;
