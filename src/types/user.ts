import { Post } from './post';

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
	newestPostId: number | null;
	posts?: Post[];
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
	newEmail: string | null;
	email: string;
	emailVerified: boolean;
	isAdmin: boolean;
	resetCode: string | null;
	verificationCode: string | null;
	verificationExpiresAt: string | null;
};
