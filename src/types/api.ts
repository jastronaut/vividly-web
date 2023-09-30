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

export interface UserInfoResponse extends DefaultResponse {
	user: User;
}

export interface UserResponse extends DefaultResponse {
	user: User;
	friendship: Friend | null;
	friendRequest: {
		id: number;
		fromUserId: number;
		toUserId: number;
	} | null;
	isBlocked: boolean;
}

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
	data: {
		notifications: {
			id: number;
			body: NotificationBody;
			createdTime: string;
			isUnread: boolean;
			sender: User;
		}[];
		unreadCount: number;
		totalCount: number;
	};
	cursor: number | null;
}

export interface LoginResponse extends DefaultResponse {
	token: string;
	user: User;
}

export interface FriendsResponse extends DefaultResponse {
	data: Friend[];
	cursor: number | null;
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
		thumb: {
			url: string;
		};
	};
	success: boolean;
	status: number;
};

export interface AuthInfoResponse extends DefaultResponse {
	authUser: AuthUser;
}

export type BlockedUser = {
	id: number;
	name: string;
	username: string;
	avatarSrc: string;
};
export type BlockedUsersResponse = DefaultResponse &
	{
		blockedUser: BlockedUser;
	}[];

export type FoursquarePlace = {
	fsq_id: string;
	name: string;
	categories: {
		id: number;
		name: string;
		icon: {
			prefix: string;
			suffix: string;
		};
	}[];
	location: {
		locality: string;
		region: string;
	};
};

export type FoursquarePlacesResponse = {
	results: FoursquarePlace[];
};

type ReportType = 'user' | 'comment' | 'post';
type ReportReason = 'Spam' | 'Inappropriate content' | 'Harassment' | 'Other';

export type Report = {
	id: number;
	reporter: {
		id: number;
		username: string;
	};
	reason: ReportReason;
	itemId: number;
	itemType: ReportType;
	createdAt: string;
};

export type AdminUserLookupResponse = DefaultResponse & {
	user: User & {
		isDeactivated: boolean;
		url: string;
		authUser: AuthUser;
		reports: Report[];
		blocked: BlockedUser[];
	};
};
