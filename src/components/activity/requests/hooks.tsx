import { useState, useCallback } from 'react';

import { makeApiCall } from '@/utils';
import {
	SendFriendRequestResponse,
	AcceptFriendRequestResponse,
	DefaultResponse,
} from '@/types/api';
import { FriendRequest, Friend } from '@/types/user';
import { useCurUserContext } from '@/components/utils/CurUserContext';

export const useAddNewFriend = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [friendRequest, setFriendRequest] = useState<FriendRequest | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const { token } = useCurUserContext().curUser;

	const addFriend = useCallback(
		async (username: string) => {
			if (!username) return;
			setError(null);
			setIsLoading(true);
			try {
				const resp = await makeApiCall<SendFriendRequestResponse>({
					uri: `/friends/add/${username}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}

				setFriendRequest(resp.friendRequest);
			} catch (err) {
				console.error(err);
				setError(`Couldn't add friend. Please try again later!`);
			}

			setIsLoading(false);
		},
		[token]
	);

	return {
		isLoading,
		friendRequest,
		error,
		addFriend,
	};
};

export const useAcceptFriendRequest = () => {
	const { token } = useCurUserContext().curUser;
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [friendship, setFriendship] = useState<Friend | null>(null);

	const acceptFriendRequest = useCallback(
		async (id: number) => {
			setIsLoading(true);
			setError(null);
			try {
				const resp = await makeApiCall<AcceptFriendRequestResponse>({
					uri: `/friends/requests/accept/${id}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}

				setFriendship(resp.friendship);
			} catch (err) {
				console.error(err);
				setError(`Couldn't accept friend request`);
			}
			setIsLoading(false);
		},
		[token]
	);

	return {
		isLoading,
		error,
		friendship,
		acceptFriendRequest,
	};
};

export const useDeclineFriendRequest = () => {
	const { token } = useCurUserContext().curUser;
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [declinedId, setDeclinedId] = useState<number | null>(null);

	const declineFriendRequest = useCallback(
		async (id: number) => {
			setIsLoading(true);
			setError(null);
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/friends/requests/reject/${id}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}
				setDeclinedId(id);
			} catch (err) {
				console.error(err);
				setError(`Couldn't decline friend request`);
			}

			setIsLoading(false);
		},
		[token]
	);

	return {
		isLoading,
		error,
		declineFriendRequest,
		declinedId,
	};
};

export const useUnfriend = () => {
	const { token } = useCurUserContext().curUser;
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const unfriend = useCallback(
		async (id: number) => {
			setIsLoading(true);
			setError(null);
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/friends/unfriend/${id}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}
			} catch (err) {
				console.error(err);
				setError(`Couldn't unfriend!`);
			}

			setIsLoading(false);
		},
		[token]
	);

	return {
		isLoading,
		error,
		unfriend,
	};
};

export const useCancelFriendRequest = () => {
	const { token } = useCurUserContext().curUser;
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const cancelFriendRequest = useCallback(
		async (id: number) => {
			setIsLoading(true);
			setError(null);
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/friends/requests/cancel/${id}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}
			} catch (err) {
				console.error(err);
				setError(`Couldn't cancel friend request!`);
			}

			setIsLoading(false);
		},
		[token]
	);

	return {
		isLoading,
		error,
		cancelFriendRequest,
	};
};

export const useToggleFavorite = () => {
	const { token } = useCurUserContext().curUser;
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const toggleFavorite = useCallback(
		async (id: number, isFavorite: boolean) => {
			setIsLoading(true);
			setError(null);
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/friends/${isFavorite ? 'un' : ''}favorite/${id}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}
			} catch (err) {
				console.error(err);
				setError(`Couldn't ${isFavorite ? 'un' : ''}favorite!`);
			}
		},
		[token]
	);

	return {
		isLoading,
		error,
		toggleFavorite,
	};
};

export const useBlockUser = () => {
	const { token } = useCurUserContext().curUser;
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const block = useCallback(
		async (id: number) => {
			setIsLoading(true);
			setError(null);
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/blocked_users/block/${id}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}
			} catch (err) {
				console.error(err);
				setError(`Couldn't block user!`);
			}

			setIsLoading(false);
		},
		[token]
	);

	const unblock = useCallback(
		async (id: number) => {
			setIsLoading(true);
			setError(null);
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/blocked_users/unblock/${id}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}
			} catch (err) {
				console.error(err);
				setError(`Couldn't unblock user!`);
			}

			setIsLoading(false);
		},
		[token]
	);

	return {
		isLoading,
		error,
		block,
		unblock,
	};
};
