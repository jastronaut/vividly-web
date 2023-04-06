import { useState } from 'react';
import { Post, BlockType, Block } from '@/types/post';

import { Footer } from '@/components/post/Footer';
import { ImageBlock } from '@/components/post/blocks/blocks';
import { LinkBlockContent } from '@/components/post/blocks/LinkBlockContent';

import { CommentsModal } from '@/components/post/comments/Comments';

function renderPostContent(content: Block, key: string) {
	switch (content.type) {
		case BlockType.TEXT:
			return <p key={key}>{content.text}</p>;
		case BlockType.IMAGE:
			return (
				<ImageBlock
					key={key}
					url={content.url}
					width={content.width}
					height={content.height}
				/>
			);
		case BlockType.LINK:
			return (
				<LinkBlockContent
					key={key}
					description={content.description}
					imageURL={content.imageURL}
					title={content.title}
					url={content.url}
				/>
			);
		default:
			return <p key={key}>Unknown block type</p>;
	}
}

type Props = {
	post: Post;
	onClickLike: (id: string, isLiked: boolean) => void;
	onAddComment: (id: string, comment: string) => void;
	onDeleteComment: (id: string, commentId: string) => void;
	onDeletePost: (id: string) => void;
	isOwnPost: boolean;
	toggleDisableComments: (id: string, isDisabled: boolean) => void;
};

export const PostPreview = (props: Props) => {
	const { post } = props;
	const [commentsOpen, setCommentsOpen] = useState(false);
	const commentCount = post.comments.length;

	return (
		<div className='post-preview'>
			{post.content.map((block, index) =>
				renderPostContent(block, index.toString())
			)}

			<CommentsModal
				isOpen={commentsOpen}
				onClose={() => setCommentsOpen(false)}
				comments={post.comments}
				onSubmit={comment => props.onAddComment(post.id, comment)}
				onDelete={id => props.onDeleteComment(post.id, id)}
				isPostAuthor={props.isOwnPost}
				commentsDisabledForFriends={post.commentsDisabled}
			/>

			<Footer
				isLiked={post.isLikedByUser}
				likeCount={post.likes}
				commentCount={commentCount}
				timestamp={post.createdTime}
				onClickComment={() => setCommentsOpen(true)}
				onClickLike={() => props.onClickLike(post.id, post.isLikedByUser)}
				onDelete={() => props.onDeletePost(post.id)}
				isOwnPost={props.isOwnPost}
				commentsDisabled={props.post.commentsDisabled}
				toggleDisableComments={() =>
					props.toggleDisableComments(post.id, post.commentsDisabled)
				}
			/>
		</div>
	);
};
