import { useEffect, useRef, useState } from 'react';
import { Button, Space, Center, Text } from '@mantine/core';
import { rem } from 'polished';
import styled from 'styled-components';
import { useDisclosure, useHeadroom } from '@mantine/hooks';

import {
	UserResponse,
	ProfileFeedResponse as Feed,
	ProfileFeedResponse,
} from '@/types/api';
import { useCurUserContext } from '@/components/utils/CurUserContext';

import { ProfileHeaderComponent } from '../header/header';
import { PostPreview } from './PostPreview';
import { FriendsDrawer } from '../drawer/FriendsDrawer';
import { ProfileContentContainer } from '../_styles';
import {
	PostsLoading,
	EmptyPosts,
	PrivateProfileMessage,
} from './ProfileMessages';
import { UnreadBanner } from '../header/UnreadBanner';

const ContentWrapper = styled.div`
	padding: ${rem(24)};
	border: 1px solid ${props => props.theme.background.secondary};
	border-top: none;

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
	const [unreadBannerShowing, setUnreadBannerShowing] = useState(true);

	const pinned = useHeadroom({ fixedAt: 120 });

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

	// these two variables suck
	const hasUnreadPosts =
		!isLoggedInUser &&
		user &&
		user.friendship &&
		user.friendship.lastReadPostId &&
		user.friendship.newestPostId &&
		user.friendship.lastReadPostId < user.friendship.newestPostId;
	const lastReadPostId =
		(user &&
			!isLoggedInUser &&
			user.friendship &&
			user.friendship.lastReadPostId &&
			user.friendship.lastReadPostId) ??
		'load-more';

	useEffect(() => {
		if (!initLoad && containerRef.current) {
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
				pinned={pinned}
			/>
			<UnreadBanner
				visible={unreadBannerShowing && hasUnreadPosts}
				postId={lastReadPostId === 'load-more' ? 'load-more' : lastReadPostId}
				onClick={() => {
					setUnreadBannerShowing(false);
				}}
			/>

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
					{feed.map((posts, index) => (
						<div
							key={`page-${index}-${posts.cursor}`}
							style={{
								display: 'flex',
								flexDirection: 'column-reverse',
							}}
						>
							{posts.data
								? posts.data.map(post => (
										<PostPreview
											key={`ppp-${post.id}`}
											post={post}
											onDeletePost={id => props.onDeletePost(id, index)}
											isOwnPost={isLoggedInUser}
											isLastRead={post.id === lastReadPostId}
										/>
								  ))
								: null}
						</div>
					))}

					{isLoading && <PostsLoading />}

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
