import React, { useState } from 'react';
import {
	createEditor,
	Descendant,
	Element as ElementType,
	Editor as SlateEditorType,
} from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import { Text } from '@mantine/core';

import { BlockType } from '../../types/editor';
import { EditorContainer } from './styles';
import { ImageBlockContent } from '../post/blocks/blocks';
import { LinkBlockContent } from '../post/blocks/LinkBlockContent';

const LinkBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	// const editor = useSlateStatic();
	// const path = ReactEditor.findPath(editor, element);

	// const selected = useSelected();
	// const focused = useFocused();
	if (element.type !== BlockType.LINK) {
		return null;
	}

	return (
		<div {...attributes}>
			<div contentEditable={false}>
				{element.url}
				<LinkBlockContent {...element} />
			</div>
			{children}
		</div>
	);
};

const ImageBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	// const editor = useSlateStatic();
	// const path = ReactEditor.findPath(editor, element);

	// const selected = useSelected();
	// const focused = useFocused();
	if (element.type !== BlockType.IMAGE) {
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
				<ImageBlockContent {...element} />
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

const withEmbeds = (props: SlateEditorType) => {
	const editor = props;
	const { isVoid } = editor;
	editor.isVoid = element =>
		element.type === BlockType.IMAGE || element.type === BlockType.LINK
			? true
			: isVoid(element);
	return editor;
};

interface BaseElementProps {
	children: React.ReactNode;
	attributes: any;
	element: ElementType;
}

const Element = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	switch (element.type) {
		case BlockType.IMAGE:
			return <ImageBlock {...props} />;
		case BlockType.LINK:
			return <LinkBlock {...props} />;
		default:
			return <Text {...attributes}>{children}</Text>;
	}
};

type EditorProps = {
	children: React.ReactNode;
	attributes: any;
	initialValue: Descendant[];
};

const Editor = (props: EditorProps) => {
	const [editor] = useState(() => withEmbeds(withReact(createEditor())));

	return (
		<EditorContainer>
			<Slate editor={editor} value={props.initialValue}>
				<Editable renderElement={props => <Element {...props} />} />
			</Slate>
		</EditorContainer>
	);
};

export default Editor;
