import React from 'react';
import { Element } from 'slate';
import { Text } from '@mantine/core';

import { BlockType as EditorBlockType } from '../../types/editor';
import { MagicTextWrapper } from './styles';
import { ImageBlock as ImageBlockContent } from '../post/blocks/blocks';
import { LinkBlockContent } from '../post/blocks/LinkBlockContent';

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
				{element.url}
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
				/>
				{/* <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={css`
            display: ${selected && focused ? 'inline' : 'none'};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
          `}
        >
          <Icon>delete</Icon>
        </Button> */}
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
