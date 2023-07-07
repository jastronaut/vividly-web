import { useEffect, useRef } from 'react';
import { Button, Space, Center, Text, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { KeyedMutator } from 'swr';

import {
	UserResponse,
	ProfileFeedResponse as Feed,
	ProfileFeedResponse,
	FriendsResponse,
} from '@/types/api';
import { useCurUserContext } from '@/components/utils/CurUserContext';

import { ProfileHeaderComponent } from '../header/header';
import { FriendsDrawer } from '../drawer/FriendsDrawer';
import { ProfileContentContainer, ContentWrapper } from '../_styles';
import { EmptyPosts, PrivateProfileMessage } from './ProfileStates';
import { UnreadBanner } from './UnreadBanner';
import { ProfilePosts } from './ProfilePosts';

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
	updateUserProfileInfo: (user: UserResponse) => void;
	refetchFeed: () => void;
	mutateFriends: KeyedMutator<FriendsResponse>;
	friendsData?: FriendsResponse;
	isFriendsLoading: boolean;
};

export const ProfileContent = (props: ProfileContentProps) => {
	const { curUser } = useCurUserContext();
	const { isUserLoading, isPostsLoading, initLoad } = props;
	const [friendsDrawerOpen, { open, close }] = useDisclosure(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const user = props.user;
	const feed: Feed[] = props.feed || [];
	const isLoggedInUser = !!user && curUser.user.id === user.user.id;

	const isLoading = isUserLoading || isPostsLoading;

	const showPrivateProfileMessage =
		!isLoading && !isLoggedInUser && !user?.friendship;

	const showEmptyState = !isLoading && feed[0] && feed[0].data.length === 0;

	const hasPages =
		feed.length > 0 || props.hasMorePosts || (feed[0] && feed[0].cursor);

	const showEndMessage =
		!isLoading &&
		!props.hasMorePosts &&
		!showEmptyState &&
		!showPrivateProfileMessage &&
		!hasPages;

	const showBottomStuff =
		(!isLoading && showEmptyState) ||
		showPrivateProfileMessage ||
		showEndMessage;

	const showMorePostsButton = !isLoading && props.hasMorePosts;

	useEffect(() => {
		if (initLoad && containerRef.current) {
			containerRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [initLoad]);

	return (
		<ContentWrapper>
			<ProfileHeaderComponent
				isLoading={props.isUserLoading}
				isLoggedInUser={isLoggedInUser}
				user={props.user}
				updateUserProfileInfo={props.updateUserProfileInfo}
				refetchFeed={props.refetchFeed}
				friendsDrawerOpen={friendsDrawerOpen}
				openFriendsDrawer={open}
				closeFriendsDrawer={close}
			/>
			<UnreadBanner user={user} />

			{isLoggedInUser && (
				<FriendsDrawer
					isOpen={friendsDrawerOpen}
					close={close}
					mutateFriends={props.mutateFriends}
					friendsData={props.friendsData}
					isFriendsLoading={props.isFriendsLoading}
				/>
			)}

			<ProfileContentContainer>
				<div>{props.children}</div>

				<ProfilePosts
					isLoggedInUser={isLoggedInUser}
					onDeletePost={props.onDeletePost}
					feed={feed}
					isLoading={isLoading}
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

				{showBottomStuff && (
					<div style={{ flex: 1 }}>
						{showEndMessage && (
							<Text c='dimmed'>{`You've reached the end!`}</Text>
						)}

						{showPrivateProfileMessage && <PrivateProfileMessage />}
						{showEmptyState && <EmptyPosts />}
					</div>
				)}
			</ProfileContentContainer>
			<div ref={containerRef} />
		</ContentWrapper>
	);
};
