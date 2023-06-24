import { DefaultResponse } from './api';
import { User } from './user';
import { BasePost } from './post';

export type FeedFriendship = {
	id: number;
	isFavorite: boolean;
	lastReadPostId: number;
	lastReadPostTime: number;
	friend: User & {
		posts?: BasePost[];
	};
};

export interface FeedResponse extends DefaultResponse {
	data: FeedFriendship[];
}

export function sortFeedFriendships(items: FeedFriendship[]): FeedFriendship[] {
	return items.sort((a, b) => {
		const lastPostA = a.friend.posts && a.friend.posts[0];
		const lastPostB = b.friend.posts && b.friend.posts[0];
		// rule 1: items without posts come last
		if (!lastPostA && !lastPostB) {
			return 0;
		} else if (!lastPostA) {
			return 1;
		} else if (!lastPostB) {
			return -1;
		}

		const isAUnread = a.lastReadPostTime < lastPostA.createdTime;
		const isBUnread = b.lastReadPostTime < lastPostB.createdTime;

		if (isAUnread && !isBUnread) {
			return -1;
		} else if (!isAUnread && isBUnread) {
			return 1;
		}

		// rule 2: sort by post created time, descending
		if (lastPostA.createdTime > lastPostB.createdTime) {
			if (a.isFavorite !== b.isFavorite) {
				return a.isFavorite ? -1 : 1;
			}
			return -1;
		} else if (lastPostA.createdTime < lastPostB.createdTime) {
			if (a.isFavorite !== b.isFavorite) {
				return a.isFavorite ? -1 : 1;
			}
			return 1;
		}

		// rule 3: if equal, favorite comes first
		if (a.isFavorite !== b.isFavorite) {
			return a.isFavorite ? -1 : 1;
		}

		return 0;
	});
}
