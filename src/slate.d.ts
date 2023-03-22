import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

import {
	CustomText,
	CustomElement,
	ImageElement,
	VideoElementType,
	BlockType,
	ElementType,
} from './types/editor';

declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor;
		Element: ElementType;
		Text: CustomText;
		BlockType: BlockType;
	}
}
