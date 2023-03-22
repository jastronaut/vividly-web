import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

export enum BlockType {
	TEXT = 'text',
	IMAGE = 'image',
	MUSIC = 'music',
	LINK = 'link',
}

export type CustomText = { text: string };
export type CustomElement = { type: 'paragraph'; children: CustomText[] };
export type ImageElement = {
	type: BlockType.IMAGE;
	url: string;
	width: number;
	height: number;
	children: CustomText[];
};
export type VideoElementType = { type: 'video'; url: string; children: string };
export type LinkElement = {
	type: BlockType.LINK;
	description?: string;
	imageURL?: string;
	title?: string;
	url: string;
	children: CustomText[];
};

export type ElementType =
	| CustomElement
	| ImageElement
	| VideoElementType
	| LinkElement;
