import React from 'react';
import { Element } from 'slate';
import { Text } from '@mantine/core';

import { EditorBlockType } from '../../types/editor';
import { MagicTextWrapper } from './styles';
import { ImageBlock as ImageBlockContent } from '../post/blocks/blocks';
import { LinkBlockContent } from '../post/blocks/LinkBlockContent';
import { MusicBlock as MusicPostBlock } from '../post/blocks/MusicBlock';
import { QuoteBlock as QuotePostBlock } from '../post/blocks/QuoteBlock';
import { LocationBlock as LocationPostBlock } from '../post/blocks/LocationBlock';
import { BlockType } from '@/types/post';

interface BaseElementProps {
	children: React.ReactNode;
	attributes: any;
	element: Element;
}

export const LinkBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	if (element.type !== EditorBlockType.LINK) {
		return null;
	}

	return (
		<div {...attributes}>
			<div contentEditable={false}>
				<LinkBlockContent hideTopUrl {...element} />
			</div>
			{children}
		</div>
	);
};

export const MagicBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	if (element.type !== EditorBlockType.MAGIC) {
		return null;
	}

	return (
		<div {...attributes}>
			<div contentEditable={false}>
				<MagicTextWrapper>
					<Text style={{ display: 'inline' }}>{element.children[0].text}</Text>
				</MagicTextWrapper>
			</div>

			{children}
		</div>
	);
};

export const ImageBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	if (element.type !== EditorBlockType.IMAGE) {
		return null;
	}

	return (
		<div {...attributes}>
			{children}
			<div
				contentEditable={false}
				style={{
					position: 'relative',
				}}
			>
				<ImageBlockContent
					url={element.url}
					width={element.width}
					height={element.height}
					thumbnailUrl={element.thumbnailURL}
				/>
			</div>
		</div>
	);
};

export const OracleBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	if (element.type !== EditorBlockType.ORACLE) {
		return null;
	}

	return (
		<div {...attributes}>
			<div contentEditable={false}>
				<MagicTextWrapper>
					<Text>☁️ {element.question}</Text>
					<Text>🔮 {element.children[0].text}</Text>
				</MagicTextWrapper>
			</div>

			{children}
		</div>
	);
};

export const MusicBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	if (element.type !== EditorBlockType.MUSIC) {
		return null;
	}

	return (
		<div {...attributes}>
			{children}
			<div contentEditable={false}>
				<MusicPostBlock inEditor {...element} type={BlockType.MUSIC} />
			</div>
		</div>
	);
};

export const QuoteBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	if (element.type !== EditorBlockType.QUOTE) {
		return null;
	}

	return (
		<div {...attributes}>
			{children}
			<div
				contentEditable={false}
				style={{
					position: 'relative',
				}}
			>
				<QuotePostBlock
					postId={element.postId}
					preview={element.preview}
					type={BlockType.QUOTE}
				/>
			</div>
		</div>
	);
};

export const LocationBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	if (element.type !== EditorBlockType.LOCATION) {
		return null;
	}

	return (
		<div {...attributes}>
			{children}
			<div
				contentEditable={false}
				style={{
					position: 'relative',
				}}
			>
				<MagicTextWrapper>
					<LocationPostBlock
						type={BlockType.LOCATION}
						name={element.name}
						locality={element.locality}
						region={element.region}
						icon={element.icon}
						inSelector
					/>
				</MagicTextWrapper>
			</div>
		</div>
	);
};
