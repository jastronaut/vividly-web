import { User } from './user';
import { Block } from '@/types/post';

type PostNotificationPreview = {
	id: number;
	block: Block;
};

export enum NotificationType {
	POST_LIKE = 'post_like',
	COMMENT = 'post_comment',
	ANNOUNCEMENT = 'announcement',
}

export interface PostLikeNotificationBody {
	type: NotificationType.POST_LIKE;
	post: PostNotificationPreview;
}

export interface CommentNotificationBody {
	type: NotificationType.COMMENT;
	post: PostNotificationPreview;
	message: string;
}

export interface AnnouncementNotificationBody {
	type: NotificationType.ANNOUNCEMENT;
	message: string;
}

export type NotificationBody =
	| PostLikeNotificationBody
	| CommentNotificationBody
	| AnnouncementNotificationBody;

export type Notification = {
	id: number;
	createdTime: string;
	isUnread: boolean;
	sender: User;
	body: NotificationBody;
};
