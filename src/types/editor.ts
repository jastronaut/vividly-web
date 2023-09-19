import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { Block } from './post';

export enum BlockType {
	TEXT = 'text',
	IMAGE = 'image',
	MUSIC = 'music',
	LINK = 'link',
	MAGIC = 'magic',
	VIDEO = 'video',
	ORACLE = 'oracle',
	QUOTE = 'quote',
}

export type CustomText = { type?: BlockType.TEXT; text: string };

export type CustomElement = { type: BlockType.TEXT; children: CustomText[] };

export type ImageElement = {
	type: BlockType.IMAGE;
	url: string;
	width: number;
	height: number;
	children: CustomText[];
};

export type VideoElementType = {
	type: BlockType.VIDEO;
	url: string;
	children: CustomText[];
};

export type LinkElement = {
	type: BlockType.LINK;
	description?: string;
	imageURL?: string;
	title?: string;
	url: string;
	children: CustomText[];
};

export type MagicElement = {
	type: BlockType.MAGIC;
	data: string;
	children: CustomText[];
};

export type OracleElement = {
	type: BlockType.ORACLE;
	question: string;
	children: CustomText[];
};

export type MusicElement = {
	type: BlockType.MUSIC;
	spotifyEmbedUrl?: string;
	appleMusicEmbedUrl?: string;
	youtubeEmbedUrl?: string;
	children: CustomText[];
};

export type QuoteElement = {
	type: BlockType.QUOTE;
	postId: number;
	preview: Block;
	children: CustomText[];
};

export type ElementType =
	| CustomElement
	| ImageElement
	| VideoElementType
	| LinkElement
	| MagicElement
	| OracleElement
	| MusicElement
	| QuoteElement;

export type Weather = {
	id: number;
	main: string;
};

export type OpenWeatherResponse = {
	main: {
		temp: number;
	};
	weather: Weather[];
	cod: number;
};
