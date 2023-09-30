import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { Block } from './post';

export enum EditorBlockType {
	TEXT = 'text',
	IMAGE = 'image',
	MUSIC = 'music',
	LINK = 'link',
	MAGIC = 'magic',
	VIDEO = 'video',
	ORACLE = 'oracle',
	QUOTE = 'quote',
	LOCATION = 'location',
}

export type CustomText = { type?: EditorBlockType.TEXT; text: string };

export type CustomElement = {
	type: EditorBlockType.TEXT;
	children: CustomText[];
};

export type ImageElement = {
	type: EditorBlockType.IMAGE;
	url: string;
	thumbnailURL?: string;
	width: number;
	height: number;
	children: CustomText[];
};

export type VideoElementType = {
	type: EditorBlockType.VIDEO;
	url: string;
	children: CustomText[];
};

export type LinkElement = {
	type: EditorBlockType.LINK;
	description?: string;
	imageURL?: string;
	title?: string;
	url: string;
	children: CustomText[];
};

export type MagicElement = {
	type: EditorBlockType.MAGIC;
	data: string;
	children: CustomText[];
};

export type OracleElement = {
	type: EditorBlockType.ORACLE;
	question: string;
	children: CustomText[];
};

export type MusicElement = {
	type: EditorBlockType.MUSIC;
	spotifyEmbedUrl?: string;
	appleMusicEmbedUrl?: string;
	youtubeEmbedUrl?: string;
	children: CustomText[];
};

export type QuoteElement = {
	type: EditorBlockType.QUOTE;
	postId: number;
	preview: Block;
	children: CustomText[];
};

export type LocationElement = {
	type: EditorBlockType.LOCATION;
	name: string;
	icon: string;
	locality: string;
	region: string;
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
	| QuoteElement
	| LocationElement;

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
