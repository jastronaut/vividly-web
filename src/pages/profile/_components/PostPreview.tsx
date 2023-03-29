import { Post, BlockType, Block } from '@/types/post';

import { Footer } from '@/components/post/Footer';
import { ImageBlock } from '@/components/post/blocks/blocks';
import { LinkBlockContent } from '@/components/post/blocks/LinkBlockContent';

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
};

export const PostPreview = (props: Props) => {
	const { post } = props;
	const commentCount = post.comments?.length || 0;

	return (
		<div className='post-preview'>
			{post.content.map((block, index) =>
				renderPostContent(block, index.toString())
			)}
			<Footer
				isLiked={post.isLikedByUser}
				likeCount={post.likes}
				commentCount={commentCount}
				timestamp={post.createdTime}
				onClickComment={() => {}}
				onClickLike={() => props.onClickLike(post.id, post.isLikedByUser)}
			/>
		</div>
	);
};
