import { Button, Space, Center, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import {
	UserResponse,
	ProfileFeedResponse as Feed,
	ProfileFeedResponse,
} from '@/types/api';
import { useCurUserContext } from '@/components/contexts/CurUserContext';

import { ProfileHeaderComponent } from '../header/header';
import { FriendsDrawer } from '../FriendsDrawer/FriendsDrawer';
import {
	ProfileContentContainer,
	ContentWrapper,
	BottomStuffContainer,
} from '../_styles';
import {
	BlockedProfileMessage,
	EmptyPosts,
	PrivateProfileMessage,
} from './ProfileStates';
import { UnreadBanner } from './UnreadBanner';
import { ProfilePosts } from './ProfilePosts';
import { Post } from '@/types/post';

type ProfileContentProps = {
	user?: UserResponse;
	initLoad: boolean;
	isUserLoading: boolean;
	feed?: ProfileFeedResponse[];
	isPostsLoading: boolean;
	onDeletePost: (id: number, pageIndex: number) => void;
	children?: React.ReactNode;
	hasMorePosts?: boolean;
	onClickLoadMore?: () => void;
	isLoggedInUser: boolean;
	onClickQuotePost: (post: Post) => void;
};

export const ProfileContent = (props: ProfileContentProps) => {
	const { curUser } = useCurUserContext();

	const { isUserLoading, isPostsLoading, isLoggedInUser } = props;
	const [friendsDrawerOpen, { open, close }] = useDisclosure(false);

	const user = props.user;
	const feed: Feed[] = props.feed || [];

	const isLoading = isUserLoading || isPostsLoading;

	const showPrivateProfileMessage =
		!isLoading && !isLoggedInUser && !user?.friendship;

	const showEmptyState =
		!isLoggedInUser && !isLoading && feed[0] && feed[0].data.length === 0;

	const hasPages =
		feed.length > 0 || props.hasMorePosts || (feed[0] && feed[0].cursor);

	const showEndMessage =
		!isLoading &&
		!props.hasMorePosts &&
		!showEmptyState &&
		!showPrivateProfileMessage &&
		!hasPages;

	const showBottomStuff =
		!isLoading &&
		(showEmptyState || showPrivateProfileMessage || showEndMessage);

	const showMorePostsButton = !isLoading && props.hasMorePosts;

	return (
		<ContentWrapper>
			<ProfileHeaderComponent
				isLoading={props.isUserLoading}
				isLoggedInUser={isLoggedInUser}
				user={props.user}
				friendsDrawerOpen={friendsDrawerOpen}
				openFriendsDrawer={open}
				closeFriendsDrawer={close}
			/>
			<UnreadBanner
				friend={user && user.friendship ? user.friendship : undefined}
			/>

			{isLoggedInUser && (
				<FriendsDrawer isOpen={friendsDrawerOpen} close={close} />
			)}

			<ProfileContentContainer
				$isLoading={isLoading || showBottomStuff}
				$isOwnProfile={isLoggedInUser}
			>
				<div>{props.children}</div>

				<ProfilePosts
					isLoggedInUser={isLoggedInUser}
					onDeletePost={props.onDeletePost}
					feed={feed}
					isLoading={isLoading}
					onClickQuotePost={props.onClickQuotePost}
				/>

				{showMorePostsButton && (
					<div>
						<Center>
							<Button
								variant='outline'
								onClick={props.onClickLoadMore}
								id='load-more'
							>
								Load More
							</Button>
						</Center>
						<Space h='sm' />
					</div>
				)}
				{showBottomStuff ? (
					<BottomStuffContainer>
						{showEndMessage && !showEmptyState ? (
							<Text c='dimmed' ta='center'>{`You've reached the end!`}</Text>
						) : null}

						{showPrivateProfileMessage && !user?.isBlocked ? (
							<PrivateProfileMessage />
						) : null}
						{showEmptyState && <EmptyPosts />}
						{user?.isBlocked && <BlockedProfileMessage />}
					</BottomStuffContainer>
				) : null}
			</ProfileContentContainer>
		</ContentWrapper>
	);
};
