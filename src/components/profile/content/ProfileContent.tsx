import { useEffect, useRef } from 'react';
import { Button, Space, Center, Text } from '@mantine/core';
import { rem } from 'polished';
import styled from 'styled-components';
import { useDisclosure } from '@mantine/hooks';

import {
	UserResponse,
	ProfileFeedResponse as Feed,
	ProfileFeedResponse,
} from '@/types/api';
import { useCurUserContext } from '@/components/utils/CurUserContext';

import { ProfileHeaderComponent } from '../header/header';
import { FriendsDrawer } from '../drawer/FriendsDrawer';
import { ProfileContentContainer } from '../_styles';
import { EmptyPosts, PrivateProfileMessage } from './ProfileMessages';
import { UnreadBanner } from './UnreadBanner';
import { ProfilePosts } from './ProfilePosts';

const ContentWrapper = styled.div`
	padding: ${rem(24)};
	border: 1px solid ${props => props.theme.background.secondary};
	border-top: none;
	border-bottom: none;

	@media screen and (max-width: 500px) {
		padding: ${rem(8)} ${rem(12)};
		border-bottom: none;
	}
`;

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

	useEffect(() => {
		if (initLoad && containerRef.current) {
			containerRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [initLoad]);

	return (
		<div>
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
				<FriendsDrawer isOpen={friendsDrawerOpen} close={close} />
			)}

			<ProfileContentContainer>
				<ContentWrapper
					style={{
						display: 'flex',
						flexDirection: 'column-reverse',
					}}
				>
					<div>{props.children}</div>

					<ProfilePosts
						isLoggedInUser={isLoggedInUser}
						onDeletePost={props.onDeletePost}
						feed={feed}
						isLoading={isLoading}
					/>

					{!props.isPostsLoading && props.hasMorePosts && (
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
						<Center
							sx={{
								margin: `${rem(24)} 0`,
							}}
						>
							{showEndMessage && (
								<Text c='dimmed'>{`You've reached the end!`}</Text>
							)}

							{showPrivateProfileMessage && <PrivateProfileMessage />}
							{showEmptyState && <EmptyPosts />}
						</Center>
					)}
				</ContentWrapper>
			</ProfileContentContainer>
			<div ref={containerRef} />
		</div>
	);
};
