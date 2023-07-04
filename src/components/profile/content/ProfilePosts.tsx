import { ProfileFeedResponse as Feed } from '@/types/api';

import { PostPreview } from './PostPreview';
import { PostsLoading } from './ProfileStates';

type Props = {
	feed: Feed[];
	onDeletePost: (id: number, pageIndex: number) => void;
	isLoggedInUser: boolean;
	isLoading: boolean;
};

export const ProfilePosts = (props: Props) => {
	const { feed, onDeletePost, isLoggedInUser } = props;

	if (props.isLoading) {
		return <PostsLoading />;
	}

	return (
		<>
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
									onDeletePost={id => onDeletePost(id, index)}
									isOwnPost={isLoggedInUser}
								/>
						  ))
						: null}
				</div>
			))}
		</>
	);
};
