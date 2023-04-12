import { Divider } from '@mantine/core';
import { Comment as CommentComponent } from './Comment';
import { Comment } from '@/types/post';
import { usePostContext } from '../PostContext';

type Props = {
	comments: Comment[];
	postAuthorId: number;
	curUserId: number;
};
export const SinglePostViewComments = (props: Props) => {
	const { comments, curUserId, postAuthorId } = props;
	const { deleteComment } = usePostContext();

	return (
		<>
			{comments.map(comment => (
				<div key={comment.id}>
					<CommentComponent
						key={comment.id}
						{...comment}
						onDelete={() => deleteComment(comment.id)}
						onClickLink={() => {}}
						canDelete={
							postAuthorId === curUserId || comment.author.id === curUserId
						}
					/>
					<Divider variant='dashed' />
				</div>
			))}
		</>
	);
};
