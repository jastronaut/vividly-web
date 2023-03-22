export enum BlockType {
	TEXT = 'text',
	IMAGE = 'image',
	MUSIC = 'music',
	LINK = 'link',
}

export type TextBlock = {
	type: BlockType.TEXT;
	text: {
		content: string;
	};
};

export type ImageBlock = {
	type: BlockType.IMAGE;
	image: {
		url: string;
		width: number;
		height: number;
	};
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

export type Block = TextBlock | ImageBlock | MusicBlock;

export type Post = {
	id: string;
	authorId: string;
	createdTime: string;
	updatedTime: string;
	commentsDisabled: boolean;
	content: Block[];
	isUpdated: boolean;
};
