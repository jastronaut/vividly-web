import { Text } from '@mantine/core';

import { ImageBlock } from '@/components/post/blocks/blocks';
import { LinkBlockContent } from '@/components/post/blocks/LinkBlockContent';
import { BlockType, Block } from '@/types/post';
import { Linkified } from '../common/Linkified';
import { QuoteBlock } from './blocks/QuoteBlock';

export function renderPostContent(
	content: Block,
	key: string,
	quoteDepth?: number
) {
	switch (content.type) {
		case BlockType.TEXT:
			return (
				<Text key={key}>
					<Linkified>{content.text}</Linkified>
				</Text>
			);
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
		case BlockType.QUOTE:
			return <QuoteBlock key={key} {...content} quoteDepth={quoteDepth} />;
		default:
			return <p key={key}>Unknown block type</p>;
	}
}

type Props = {
	blocks: Block[];
	postId: number;
};

export const Content = (props: Props) => {
	const { blocks, postId } = props;
	return (
		<>
			{blocks.map((block, index) =>
				renderPostContent(block, `post-${postId}-${index}`)
			)}
		</>
	);
};
