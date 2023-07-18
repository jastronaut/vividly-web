import { Divider, Space } from '@mantine/core';
import { Comment as CommentComponent } from './Comment';
import { Comment } from '@/types/post';
import { usePostContext } from '../PostContext';

type Props = {
	comments: Comment[];
	postAuthorId: number;
	curUserId: number;
	onClickCommentByUsername: (userId: string) => void;
};

export const SinglePostViewComments = (props: Props) => {
	const { comments, curUserId, postAuthorId } = props;
	const { deleteComment } = usePostContext();

	return (
		<>
			{comments.map(comment => (
				<div key={comment.id}>
					<Space h='sm' />
					<CommentComponent
						key={comment.id}
						{...comment}
						onDelete={() => deleteComment(comment.id)}
						onClickLink={() => {}}
						canDelete={
							postAuthorId === curUserId || comment.author.id === curUserId
						}
						onClickComment={() => {
							props.onClickCommentByUsername(comment.author.name);
						}}
					/>
					<Divider variant='dashed' />
				</div>
			))}
		</>
	);
};
