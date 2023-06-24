import { User, FriendRequest, Friend, AuthUser } from './user';
import { Post, BasePost } from './post';
import { NotificationBody } from './notification';

export type DefaultResponse = {
	success: boolean;
	error?: string;
	errorCode?: string;
};

export type LikesResponse = {
	likes: number;
};

export type UserResponse = {
	user: User;
	friendship: Friend | null;
	friendRequest: {
		id: number;
		fromUserId: number;
		toUserId: number;
	} | null;
	isBlocked: boolean;
};

export type ProfileFeedResponse = {
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
	friendship: Friend;
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
	unreadCount: number;
	totalCount: number;
}

export interface LoginResponse extends DefaultResponse {
	token: string;
	user: User;
}

export interface FriendsRespose extends DefaultResponse {
	friends: Friend[];
}

export interface FeedResponse extends DefaultResponse {
	userFeeds: {
		user: User;
		lastPost: BasePost;
	}[];
}

export type ImgBBUploadResponse = {
	data: {
		id: string;
		url: string;
		display_url: string;
		width: number;
		height: number;
		image: {
			url: string;
		};
	};
	success: boolean;
	status: number;
};

export interface AuthInfoResponse extends DefaultResponse {
	authUser: AuthUser;
}
