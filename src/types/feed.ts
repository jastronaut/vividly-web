import { DefaultResponse } from './api';
import { User } from './user';
import { BasePost } from './post';

export type FeedFriendship = {
	id: number;
	isFavorite: boolean;
	lastReadPostId: number;
	lastReadPostTime: string;
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

		// rule 2: sort by post created time, descending
		const timeDiff = lastPostB.createdTime - lastPostA.createdTime;
		if (timeDiff !== 0) {
			return timeDiff;
		}

		// rule 3: if equal, favorite comes first
		if (a.isFavorite !== b.isFavorite) {
			return a.isFavorite ? -1 : 1;
		}

		// rule 4: items with last read post after created time come last
		const aLastReadTime = Date.parse(a.lastReadPostTime);
		const bLastReadTime = Date.parse(b.lastReadPostTime);
		const createdTime = lastPostA.createdTime;
		if (aLastReadTime >= createdTime && bLastReadTime >= createdTime) {
			return bLastReadTime - aLastReadTime;
		} else if (aLastReadTime >= createdTime) {
			return 1;
		} else if (bLastReadTime >= createdTime) {
			return -1;
		}

		// default: no change
		return 0;
	});
}
