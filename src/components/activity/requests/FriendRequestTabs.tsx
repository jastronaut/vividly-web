import { useEffect, useCallback } from 'react';
import useSWR from 'swr';
import {
	Tabs,
	Center,
	Badge,
	Text,
	Container,
	Title,
	Space,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { AddFriendForm } from './AddFriendForm';
import { FriendRequest } from '@/types/user';
import { showAndLogErrorNotification } from '@/showerror';
import { fetchWithToken } from '@/utils';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import {
	FriendRequestItem,
	LoadingItem,
} from '@/components/activity/requests/FriendRequestItem';
import { TabsWrapper } from './_style';
import { makeApiCall } from '@/utils';
import {
	AcceptFriendRequestResponse,
	DefaultResponse,
	FriendRequestsResponse,
	SendFriendRequestResponse,
} from '@/types/api';

const EmptyTab = () => {
	return (
		<Container py={36} px={0}>
			<Text style={{ textAlign: 'center' }}>Nothing to see here!</Text>
		</Container>
	);
};

export const FriendRequestTabs = () => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;
	const {
		data,
		isLoading,
		error: loadFriendsError,
		mutate,
	} = useSWR<FriendRequestsResponse>(
		[token ? `http://localhost:1337/v0/friends/requests` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const outboundCount = data?.outbound.length;
	const inboundCount = data?.inbound.length;

	const addFriendByUsername = useCallback(
		async (username: string) => {
			try {
				const resp = await makeApiCall<SendFriendRequestResponse>({
					uri: `/friends/add/${username}`,
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
							outbound: [...data.outbound, resp.friendRequest],
						};
					}
				});
				notifications.show({
					message: `Friend request sent to @${username}!`,
					color: 'teal',
				});
			} catch (err) {
				showAndLogErrorNotification(`Couldn't add friend`, err);
			}
		},
		[token, mutate]
	);

	const onClickAccept = useCallback(
		async (id: number) => {
			try {
				const resp = await makeApiCall<AcceptFriendRequestResponse>({
					uri: `/friends/accept/${id}`,
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
				showAndLogErrorNotification(`Couldn't accept friend request`, err);
			}
		},
		[token, mutate]
	);

	const onClickDecline = useCallback(
		async (id: number) => {
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/friends/reject/${id}`,
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

	return (
		<>
			<Center>
				<TabsWrapper>
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
							{data?.inbound.map(friend => {
								return (
									<FriendRequestItem
										key={friend.id}
										user={friend.user}
										onClickDecline={() => onClickDecline(friend.user.id)}
										onClickAccept={() => onClickAccept(friend.user.id)}
										onClickBlock={() => onClickBlock(friend.user.id, true)}
									/>
								);
							})}
							{isLoading && <LoadingItem />}
							{!isLoading && !inboundCount && <EmptyTab />}
						</Tabs.Panel>
						<Tabs.Panel value='sent' pt='xs'>
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
							{isLoading && <LoadingItem />}
							{!isLoading && !outboundCount && <EmptyTab />}
						</Tabs.Panel>
					</Tabs>
					<Space h='lg' />
					<AddFriendForm onSubmit={addFriendByUsername} />
				</TabsWrapper>
			</Center>
		</>
	);
};
