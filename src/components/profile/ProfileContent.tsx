import { Button, Skeleton, Stack, Space, Center, Text } from '@mantine/core';
import { rem } from 'polished';
import styled from 'styled-components';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

import {
	UserResponse,
	ProfileFeedResponse as Feed,
	ProfileFeedResponse,
} from '@/types/api';
import { User } from '@/types/user';
import { useCurUserContext } from '@/components/utils/CurUserContext';

import { ProfileHeaderComponent } from './header/header';
import { PostPreview } from './PostPreview';
import { FriendsDrawer } from './drawer/FriendsDrawer';

const ContentWrapper = styled.div`
	padding: ${rem(8)} ${rem(24)};
`;

type ProfileContentProps = {
	user?: UserResponse;
	isUserLoading: boolean;
	feed?: ProfileFeedResponse[];
	isPostsLoading: boolean;
	onDeletePost: (id: number, pageIndex: number) => void;
	children?: React.ReactNode;
	hasMorePosts?: boolean;
	onClickLoadMore?: () => void;
	updateUserProfileInfo: (user: UserResponse) => void;
	openEditor: () => void;
	refetchFeed: () => void;
};

const PostsLoading = () => {
	return (
		<Stack>
			<Space h='md' />
			<Skeleton height={20} />
			<Skeleton height={20} />
			<Skeleton height={20} />
			<Skeleton height={20} mt={6} width='70%' />
		</Stack>
	);
};

const EmptyPosts = (props: { children?: React.ReactNode }) => {
	return (
		<Center
			sx={{
				marginTop: rem(48),
			}}
		>
			<Stack>
				<Text align='center' c='dimmed'>
					No posts... yet!
				</Text>
				{props.children}
			</Stack>
		</Center>
	);
};

const PrivateProfileMessage = () => {
	return (
		<Center
			sx={{
				marginTop: rem(48),
			}}
		>
			<Stack>
				<Text align='center' c='dimmed'>
					{`🔒 You need to be friends with this user to view their posts.`}
				</Text>
			</Stack>
		</Center>
	);
};

export const ProfileContent = (props: ProfileContentProps) => {
	const { curUser } = useCurUserContext();
	const { isUserLoading, isPostsLoading } = props;
	const [friendsDrawerOpen, { open, close }] = useDisclosure(false);

	const user = props.user;
	const feed: Feed[] = props.feed || [];
	const isLoggedInUser = !!user && curUser.user.id === user.user.id;

	const showEmptyState =
		!isUserLoading && !isPostsLoading && feed[0] && feed[0].data.length === 0;

	const showLoadingState = isUserLoading || isPostsLoading;
	const showPrivateProfileMessage =
		!isUserLoading && !isLoggedInUser && !user?.friendship;

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

			<FriendsDrawer isOpen={friendsDrawerOpen} close={close} />
			{props.children}

			<ContentWrapper>
				{feed.map((posts, index) => (
					<div key={`page-${index}-${posts.cursor}`}>
						{posts.data
							? posts.data.map(post => (
									<PostPreview
										key={post.id}
										post={post}
										onDeletePost={id => props.onDeletePost(id, index)}
										isOwnPost={isLoggedInUser}
									/>
							  ))
							: null}
					</div>
				))}

				{showLoadingState && <PostsLoading />}

				{showPrivateProfileMessage && <PrivateProfileMessage />}

				{showEmptyState && (
					<EmptyPosts>
						{isLoggedInUser ? (
							<Button
								size='sm'
								onClick={props.openEditor}
								leftIcon={<IconPlus />}
							>
								Create a post
							</Button>
						) : null}
					</EmptyPosts>
				)}

				{!props.isPostsLoading && props.hasMorePosts && (
					<Button onClick={props.onClickLoadMore}>Load More</Button>
				)}
			</ContentWrapper>
		</div>
	);
};
