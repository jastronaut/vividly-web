import { Post } from '@/types/post';
import { Divider, Space, Affix } from '@mantine/core';
import { rem } from 'polished';

import { Content } from './Content';
import { CurUser } from '@/types/user';
import { Footer } from './Footer';
import { NewCommentInput } from './comments/NewCommentInput';
import { SinglePostViewComments } from './comments/SinglePostViewComments';

type Props = {
	post: Post;
	curUser: CurUser;
};

export const SinglePostView = (props: Props) => {
	const { post, curUser } = props;

	return (
		<>
			<Content blocks={post.content} postId={post.id} />
			<Footer
				onClickLike={() => {}}
				onClickComment={() => {}}
				onDelete={() => {}}
				isLiked={post.isLikedByUser}
				timestamp={post.createdTime}
				toggleDisableComments={() => {}}
				commentsDisabled={post.commentsDisabled}
				likeCount={post.likes}
				commentCount={post.comments.length}
				isOwnPost={true}
			/>
			<Space h='lg' />
			<Divider />
			<Space h='lg' />
			<SinglePostViewComments
				comments={post.comments}
				postAuthorId={post.authorId}
				curUserId={curUser.user.id}
				commentAuthorId={post.comments[0].authorId}
			/>

			<Affix
				position={{ bottom: 0, right: 0 }}
				sx={{ padding: rem(16), zIndex: 50, width: '80%' }}
			>
				<NewCommentInput
					onSubmit={() => {}}
					disabled={post.commentsDisabled || curUser.user.id !== post.authorId}
				/>
			</Affix>
		</>
	);
};
