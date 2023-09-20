export type Comment = {
	id: number;
	authorId: number;
	createdTime: string;
	content: string;
	postId: number;
	author: {
		id: number;
		name: string;
		username: string;
		avatarSrc: string;
	};
};

export enum BlockType {
	TEXT = 'text',
	IMAGE = 'image',
	MUSIC = 'music',
	LINK = 'link',
	QUOTE = 'quote',
	LOCATION = 'location',
}

export type TextBlock = {
	type: BlockType.TEXT;
	text: string;
};

export type ImageBlock = {
	type: BlockType.IMAGE;
	url: string;
	width: number;
	height: number;
};

export type MusicBlock = {
	type: BlockType.MUSIC;
	spotifyEmbedUrl?: string;
	appleMusicEmbedUrl?: string;
	youtubeEmbedUrl?: string;
};

export type LinkBlock = {
	type: BlockType.LINK;
	description?: string;
	imageURL?: string;
	title?: string;
	url: string;
};

export type QuoteBlock = {
	type: BlockType.QUOTE;
	postId: number;
	preview: Block;
};

export type LocationBlock = {
	type: BlockType.LOCATION;
	locality: string;
	region: string;
	name: string;
	icon: string;
};

export type Block =
	| TextBlock
	| ImageBlock
	| MusicBlock
	| LinkBlock
	| QuoteBlock
	| LocationBlock;

export type BasePost = {
	id: number;
	authorId: number;
	createdTime: number;
	content: Block[];
};

export interface Post extends BasePost {
	commentsDisabled: boolean;
	isUpdated: boolean;
	likes: number;
	comments: Comment[];
	isLikedByUser: boolean;
	author?: {
		id: number;
		name: string;
		username: string;
		avatarSrc: string;
	};
}
