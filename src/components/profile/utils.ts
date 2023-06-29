import { Friend } from '@/types/user';

export const sortFriends = (a: Friend, b: Friend) => {
	if (a.isFavorite && !b.isFavorite) {
		return -1;
	}
	if (!a.isFavorite && b.isFavorite) {
		return 1;
	}

	if (a.friend.username < b.friend.username) {
		return -1;
	}
	if (a.friend.username > b.friend.username) {
		return 1;
	}
	return 0;
};
