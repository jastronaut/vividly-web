import { useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { Tabs, Center, Badge, Title, Space } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { AddFriendForm } from './AddFriendForm';
import { FriendRequest } from '@/types/user';
import { showAndLogErrorNotification } from '@/showerror';
import { fetchWithToken, throwConfetti } from '@/utils';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { FriendRequestItem } from '@/components/activity/requests/FriendRequestItem';
import { PageWrapper } from './_style';
import { makeApiCall } from '@/utils';
import { URL_PREFIX } from '@/constants';
import {
	AcceptFriendRequestResponse,
	DefaultResponse,
	FriendRequestsResponse,
} from '@/types/api';
import { EmptyTab, LoadingTab } from '../TabStates';
import {
	useAcceptFriendRequest,
	useAddNewFriend,
	useDeclineFriendRequest,
	useCancelFriendRequest,
} from './hooks';
import { FadeIn } from '@/styles/Animations';

export const FriendRequestTabs = () => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;
	const {
		data,
		isLoading,
		error: loadFriendsError,
		mutate,
	} = useSWR<FriendRequestsResponse>(
		[token ? `${URL_PREFIX}/friends/requests` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const outboundCount = data?.outbound.length;
	const inboundCount = data?.inbound.length;

	const {
		acceptFriendRequest,
		isLoading: acceptLoading,
		error: acceptError,
		friendship,
	} = useAcceptFriendRequest();
	const {
		declineFriendRequest,
		isLoading: declineLoading,
		error: declineError,
		declinedId,
	} = useDeclineFriendRequest();
	const {
		cancelFriendRequest,
		isLoading: cancelLoading,
		error: cancelError,
	} = useCancelFriendRequest();

	const addFriendRequest = (friendRequest: FriendRequest) => {
		mutate(data => {
			if (data) {
				return {
					...data,
					outbound: [...data.outbound, friendRequest],
				};
			}
		});
		notifications.show({
			message: `Friend request sent to @${friendRequest.user.username}!`,
			color: 'teal',
		});
	};

	const onClickDecline = useCallback(
		async (id: number) => {
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/friends/requests/reject/${id}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}

				mutate(data => {
					if (data) {
						return {
							...data,
							inbound: data.inbound.filter(
								(req: FriendRequest) => req.user.id !== id
							),
						};
					}

					return data;
				});
			} catch (err) {
				showAndLogErrorNotification(`Couldn't decline friend request`, err);
			}
		},
		[token, mutate]
	);

	const onClickBlock = useCallback(
		async (id: number, isInbound: boolean) => {
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/block/${id}`,
					method: 'POST',
					token,
				});

				if (!resp.success) {
					throw new Error(resp.error);
				}

				mutate(data => {
					if (data) {
						return {
							...data,
							inbound: isInbound
								? data.inbound.filter(
										(req: FriendRequest) => req.user.id !== id
								  )
								: data.inbound,
							outbound: !isInbound
								? data.outbound.filter(
										(req: FriendRequest) => req.user.id !== id
								  )
								: data.outbound,
						};
					}

					return data;
				});
			} catch (err) {
				showAndLogErrorNotification(`Couldn't block user`, err);
			}
		},
		[token, mutate]
	);

	useEffect(() => {
		if (loadFriendsError) {
			showAndLogErrorNotification(
				`Couldn't load friend requests`,
				loadFriendsError
			);
		}
	}, [loadFriendsError]);

	useEffect(() => {
		if (acceptError) {
			showAndLogErrorNotification(
				`Couldn't accept friend request`,
				acceptError
			);
		}
	}, [acceptError]);

	useEffect(() => {
		if (declineError) {
			showAndLogErrorNotification(
				`Couldn't decline friend request`,
				declineError
			);
		}
	}, [declineError]);

	useEffect(() => {
		if (cancelError) {
			showAndLogErrorNotification(
				`Couldn't cancel friend request`,
				cancelError
			);
		}
	}, [cancelError]);

	useEffect(() => {
		if (friendship && !isLoading) {
			mutate(data => {
				if (data) {
					return {
						...data,
						inbound: data.inbound.filter(
							(req: FriendRequest) => req.user.id !== friendship.friend.id
						),
					};
				}

				return data;
			});
			notifications.show({
				message: `You're now friends with @${friendship.friend.username}!`,
				color: 'teal',
			});
			throwConfetti();
		}
	}, [friendship, isLoading, mutate]);

	useEffect(() => {
		if (declinedId === null || declineLoading) {
			return;
		}

		mutate(data => {
			if (data) {
				return {
					...data,
					inbound: data.inbound.filter(
						(req: FriendRequest) => req.id !== declinedId
					),
				};
			}
		});
	}, [declinedId, declineLoading, mutate]);

	return (
		<>
			<Center>
				<PageWrapper>
					<Title order={3}>Friend Requests</Title>
					<Space h='xs' />
					<Tabs defaultValue='received' color='grape'>
						<Tabs.List>
							<Tabs.Tab
								value='received'
								rightSection={
									inboundCount ? (
										<Badge
											w={16}
											h={16}
											sx={{ pointerEvents: 'none' }}
											variant='filled'
											size='xs'
											p={0}
											color='grape'
										>
											{inboundCount}
										</Badge>
									) : null
								}
							>
								📥 Received
							</Tabs.Tab>
							<Tabs.Tab
								rightSection={
									outboundCount ? (
										<Badge
											w={16}
											h={16}
											sx={{ pointerEvents: 'none' }}
											variant='filled'
											size='sm'
											p={0}
											color='grape'
										>
											{outboundCount}
										</Badge>
									) : null
								}
								value='sent'
							>
								📤 Sent
							</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value='received' pt='xs'>
							<FadeIn>
								{data?.inbound.map(friend => {
									return (
										<FriendRequestItem
											key={friend.id}
											user={friend.user}
											onClickDecline={() => declineFriendRequest(friend.id)}
											onClickAccept={() => acceptFriendRequest(friend.id)}
											onClickBlock={() => onClickBlock(friend.user.id, true)}
										/>
									);
								})}
								{isLoading && <LoadingTab />}
								{!isLoading && !inboundCount && <EmptyTab />}
							</FadeIn>
						</Tabs.Panel>
						<Tabs.Panel value='sent' pt='xs'>
							<FadeIn>
								{data?.outbound.map(friend => {
									return (
										<FriendRequestItem
											key={friend.id}
											user={friend.user}
											onClickDecline={() => onClickDecline(friend.user.id)}
											onClickBlock={() => onClickBlock(friend.user.id, false)}
										/>
									);
								})}
								{isLoading && <LoadingTab />}
								{!isLoading && !outboundCount && <EmptyTab />}
							</FadeIn>
						</Tabs.Panel>
					</Tabs>
				</PageWrapper>
			</Center>
			<Center>
				<div>
					<AddFriendForm onSubmit={addFriendRequest} />
				</div>
			</Center>
		</>
	);
};
