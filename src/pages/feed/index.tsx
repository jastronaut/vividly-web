import { Page } from '../_app';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import Link from 'next/link';
import styled from 'styled-components';
import { rem } from 'polished';
import { IconMoodPlus, IconPencil } from '@tabler/icons-react';
import { Text, Button } from '@mantine/core';

import { FeedPreview } from '@/components/feed/FeedPreview';
import AppLayout from '@/components/layout/AppLayout';
import { FadeIn } from '@/styles/Animations';
import { FeedPreviewLoading } from '@/components/feed/FeedPreview';
import { useFeedContext } from '@/components/utils/FeedContext';

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
	const { feed: items, isLoading } = useFeedContext();

	const showLoadingState = isLoading || !curUser;

	return (
		<FadeIn>
			{showLoadingState && <LoadingState />}
			{items ? (
				items.length > 0 ? (
					items.map(item => (
						<Link
							href={`/profile/${item.friend.id}`}
							key={`link-${item.friend.id}`}
						>
							<FeedPreview item={item} />
						</Link>
					))
				) : (
					<EmptyState id={curUser.user.id} />
				)
			) : null}
		</FadeIn>
	);
};

FeedPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default FeedPage;
