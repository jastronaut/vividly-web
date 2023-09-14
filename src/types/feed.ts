import { DefaultResponse } from './api';
import { User } from './user';
import { BasePost } from './post';

export type FeedFriendship = {
	id: number;
	isFavorite: boolean;
	lastReadPostId: number;
	lastReadPostTime: number;
	isUnread: boolean;
	friend: User & {
		posts?: BasePost[];
	};
};

export interface FeedResponse extends DefaultResponse {
	data: FeedFriendship[];
}
