export type Comment = {
	id: string;
	authorId: string;
	createdTime: string;
	content: string;
	postId: string;
	author: {
		id: string;
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
	music: {
		title: string;
		spotifyData?: {
			album: {
				name: string;
			};

			artists: {
				name: string;
			}[];

			track: {
				id: string;
				name: string;
			};
		};
	};
};

export type LinkBlock = {
	type: BlockType.LINK;
	description?: string;
	imageURL?: string;
	title?: string;
	url: string;
};

export type Block = TextBlock | ImageBlock | MusicBlock | LinkBlock;

export type Post = {
	id: string;
	authorId: string;
	createdTime: number;
	commentsDisabled: boolean;
	content: Block[];
	isUpdated: boolean;
	likes: number;
	comments: Comment[];
	isLikedByUser: boolean;
	author?: {
		id: string;
		name: string;
		username: string;
		avatarSrc: string;
	};
};
