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
	MENTION = 'post_mention',
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

export type MentionNotificationBody = {
	type: NotificationType.MENTION;
	post: PostNotificationPreview;
};

export interface AnnouncementNotificationBody {
	type: NotificationType.ANNOUNCEMENT;
	message: string;
}

export type NotificationBody =
	| PostLikeNotificationBody
	| CommentNotificationBody
	| AnnouncementNotificationBody
	| MentionNotificationBody;

export type Notification = {
	id: number;
	createdTime: string;
	isUnread: boolean;
	sender: User;
	body: NotificationBody;
};
