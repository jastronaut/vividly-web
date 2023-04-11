import { User, FriendshipInfo, FriendRequest } from './user';
import { Post } from './post';

export type DefaultResponse = {
	success: boolean;
	error?: string;
};

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

export type IMGBBResponse = {
	data: {
		id: string;
		url: string;
	};
	success: boolean;
};

export type PostResponse = {
	post: Post;
	error?: string;
};

export interface NewCommentResponse extends DefaultResponse {
	comment: {
		id: string;
		postId: string;
		createdTime: string;
		content: string;
	};
}

export type FriendRequestsResponse = {
	inbound: FriendRequest[];
	outbound: FriendRequest[];
};
export interface AcceptFriendRequestResponse extends DefaultResponse {
	friendship: FriendshipInfo;
}

export interface SendFriendRequestResponse extends DefaultResponse {
	friendRequest: FriendRequest;
}
