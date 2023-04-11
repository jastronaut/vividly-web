import { User, FriendshipInfo, FriendRequest } from './user';
import { Post } from './post';
import { NotificationBody } from './notification';

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
		fromUserId: number;
		toUserId: number;
	} | null;
	isBlocked: boolean;
};

export type FeedResponse = {
	data: Post[];
	cursor: number | null;
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
		id: number;
		postId: number;
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

export interface NotificationsResponse extends DefaultResponse {
	notifications: {
		id: number;
		body: NotificationBody;
		createdTime: string;
		isUnread: boolean;
		sender: User;
	}[];
}
