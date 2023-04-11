import { Button } from '@mantine/core';

import { UserResponse, FeedResponse as Feed } from '@/types/api';
import { User } from '@/types/user';
import { useCurUserContext } from '@/components/utils/CurUserContext';

import { ProfileHeaderComponent } from './header/header';
import { PostPreview } from './PostPreview';

type ProfileContentProps = {
	user?: UserResponse;
	isUserLoading: boolean;
	feed?: Feed[];
	isPostsLoading: boolean;
	onDeletePost: (id: string, pageIndex: number) => void;
	children?: React.ReactNode;
	hasMorePosts?: boolean;
	onClickLoadMore?: () => void;
	updateUserProfileInfo?: (user: User) => void;
};

export const ProfileContent = (props: ProfileContentProps) => {
	const { curUser } = useCurUserContext();
	const user = props.user;
	const feed: Feed[] = props.feed || [];
	const isLoggedInUser = !!user && curUser.user.id === user.user.id;
	console.log('user', user);
	console.log('curUser', curUser);
	return (
		<div>
			<ProfileHeaderComponent
				isLoading={props.isUserLoading}
				isLoggedInUser={isLoggedInUser}
				user={props.user}
				updateUserProfileInfo={props.updateUserProfileInfo}
			/>
			{props.children}
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

			{!props.isPostsLoading && props.hasMorePosts && (
				<Button onClick={props.onClickLoadMore}>Load More</Button>
			)}
			{props.isPostsLoading && <div>Loading...</div>}
			{/* {!props.isPostsLoading && props.posts.length === 0 && (
				<Center style={{ minHeight: '250px' }}>
					<Text>No posts yet!</Text>
				</Center>
			)} */}
		</div>
	);
};
