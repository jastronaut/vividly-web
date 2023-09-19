import { ImageBlock } from '@/components/post/blocks/blocks';
import { LinkBlockContent } from '@/components/post/blocks/LinkBlockContent';
import { BlockType, Block } from '@/types/post';
import { Linkified } from '../common/Linkified';
import { QuoteBlock } from './blocks/QuoteBlock';

export function renderPostContent(content: Block, key: string) {
	switch (content.type) {
		case BlockType.TEXT:
			return <Linkified key={key}>{content.text}</Linkified>;
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
			return <QuoteBlock key={key} {...content} />;
		default:
			return <p key={key}>Unknown block type</p>;
	}
}
