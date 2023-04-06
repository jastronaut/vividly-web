import { User, FriendshipInfo } from './user';

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
