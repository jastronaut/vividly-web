import { useEffect } from 'react';
import useSWR from 'swr';
import { Tabs, Center, Badge, Text, Container } from '@mantine/core';

import { FriendRequest } from '@/types/user';
import { showAndLogErrorNotification } from '@/showerror';
import { fetchWithToken } from '../../utils';
import { Page } from '../_app';
import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import {
	FriendRequestItem,
	LoadingItem,
} from '@/components/friends/FriendRequestItem';
import { TabsWrapper } from '../../components/friends/_style';
import AppShellLayout from '@/components/layout/AppShellLayout';

const EmptyTab = () => {
	return (
		<Container py={36} px={0}>
			<Text style={{ textAlign: 'center' }}>Nothing to see here!</Text>
		</Container>
	);
};

type FriendRequestsResponse = {
	inbound: FriendRequest[];
	outbound: FriendRequest[];
};

const Friends = () => {
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

	const onClickAccept = (id: string) => {
		fetch(`http://localhost:1337/v0/friends/accept/${id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(res => res.json())
			.then(res => {
				console.log(res);
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
			})
			.catch(err => {
				showAndLogErrorNotification(`Couldn't accept friend request`, err);
			});
	};

	const onClickDecline = (id: string) => {
		fetch(`http://localhost:1337/v0/friends/reject/${id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(res => res.json())
			.then(res => {
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
			})
			.catch(err => {
				showAndLogErrorNotification(`Couldn't decline friend request`, err);
			});
	};

	const onClickBlock = (id: string, isInbound: boolean) => {
		fetch(`http://localhost:1337/v0/block/${id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then(res => res.json())
			.then(res => {
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
			})
			.catch(err => {
				showAndLogErrorNotification(`Couldn't block user`, err);
			});
	};

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
				</TabsWrapper>
			</Center>
		</>
	);
};

const FriendsPage: Page = props => {
	const { curUser, isLoading } = useCurUserContext();

	return <>{!curUser.token ? <div>Loading</div> : <Friends />}</>;
};

FriendsPage.getLayout = (page: React.ReactNode) => {
	return (
		<AppShellLayout>
			<CurUserProvider>{page}</CurUserProvider>
		</AppShellLayout>
	);
};

export default FriendsPage;
