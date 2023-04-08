import { User, FriendshipInfo } from './user';
import { Post } from './post';

export type LikesResponse = {
	likes: number;
};

export type UserResponse = {
	user: User;
	friendship: FriendshipInfo | null;
	friendRequest: {
		fromUserId: string;
		toUserId: string;
	} | null;
	isBlocked: boolean;
};

export type FeedResponse = {
	data: Post[];
	cursor: string | null;
};
