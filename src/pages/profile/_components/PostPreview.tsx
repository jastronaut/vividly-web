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

export const PostPreview = (props: Post) => {
	const { content } = props;
	const commentCount = props.comments?.length || 0;
	const isLiked = props?.isLikedByUser || false;

	return (
		<div className='post-preview'>
			{content.map((block, index) =>
				renderPostContent(block, index.toString())
			)}
			<Footer
				isLiked={isLiked}
				likeCount={props.likes}
				commentCount={commentCount}
				timestamp={props.createdTime}
				onClickComment={() => {}}
				onClickLike={() => {}}
			/>
			<hr />
		</div>
	);
};
