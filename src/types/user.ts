export type User = {
	id: string;
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
	id: string;
	friendType: FriendType;
	isFavorite: boolean;
	user: User;
};

export type FriendRequest = {
	id: string;
	createdTime: string;
	user: User;
};

export type FriendshipInfo = {
	isFavorite: boolean;
	lastReadPostId: string;
	lastReadPostTime: string;
};
