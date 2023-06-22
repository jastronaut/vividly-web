export type User = {
	id: number;
	bio: string;
	avatarSrc: string;
	name: string;
	username: string;
};

export type CurUser = {
	token: string;
	user: User;
};

export enum FriendType {
	FRIEND = 'friend',
	FOLLOWER = 'follower',
	FOLLOWING = 'following',
}

export type Friend = {
	id: number;
	isFavorite: boolean;
	lastReadPostId: number | null;
	lastReadPostTime: string;
	friend: User;
};

export type FriendRequest = {
	id: number;
	createdTime: string;
	user: User;
};

export type FriendshipInfo = {
	isFavorite: boolean;
	lastReadPostId?: string;
	lastReadPostTime: string;
};

export type AuthUser = {
	email: string;
	emailVerified: boolean;
};
