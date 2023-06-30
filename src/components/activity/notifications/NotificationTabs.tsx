import { useEffect } from 'react';
import useSWR from 'swr';
import { Tabs, Center, Title, Space, Badge } from '@mantine/core';

import { NotificationItem } from './NotificationItem';
import { TabsWrapper } from '../requests/_style';
import { showAndLogErrorNotification } from '@/showerror';
import { NotificationsResponse, DefaultResponse } from '@/types/api';
import { fetchWithToken } from '@/utils';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { NotificationType } from '@/types/notification';
import { EmptyTab, LoadingTab } from '../TabStates';
import { makeApiCall } from '@/utils';
import { URL_PREFIX } from '@/constants';
import { FadeIn } from '@/styles/Animations';

export const NotificationTabs = () => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const { data, isLoading, error } = useSWR<NotificationsResponse>(
		[token ? `${URL_PREFIX}/notifications` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const totalUnreadCount = data?.unreadCount;
	const totalCount = data?.totalCount;

	const commentNotifications = data?.notifications.filter(
		notif => notif.body.type === NotificationType.COMMENT
	);
	const commentNotificationsCount = commentNotifications?.length;
	const unreadCommentNotificationsCount = commentNotifications?.filter(
		notif => notif.isUnread
	).length;

	const likeNotifications = data?.notifications.filter(
		notif => notif.body.type === NotificationType.POST_LIKE
	);
	const likeNotificationsCount = likeNotifications?.length;
	const unreadLikeNotificationsCount = likeNotifications?.filter(
		notif => notif.isUnread
	).length;

	useEffect(() => {
		if (error) {
			showAndLogErrorNotification(`Couldn't load friend requests`, error);
		}
	}, [error]);

	useEffect(() => {
		const markNotificationsAsRead = async () => {
			if (!token || !totalUnreadCount) return;
			try {
				const resp = await makeApiCall<DefaultResponse>({
					uri: `/notifications/read`,
					method: 'POST',
					token,
				});
				if (!resp.success) {
					throw new Error(resp.error);
				}
			} catch (err) {
				showAndLogErrorNotification(`Couldn't mark notifications as read`, err);
			}
		};

		markNotificationsAsRead();
	}, [totalUnreadCount]);

	return (
		<>
			<Center>
				<TabsWrapper>
					<Title order={3}>Notifications</Title>
					<Space h='xl' />
					<Tabs color='grape' defaultValue='all'>
						<Tabs.List>
							<Tabs.Tab
								value='all'
								rightSection={
									totalUnreadCount ? (
										<Badge
											w={16}
											h={16}
											sx={{ pointerEvents: 'none' }}
											variant='filled'
											size='sm'
											p={0}
											color='grape'
										>
											{totalUnreadCount}
										</Badge>
									) : null
								}
							>
								⭐️ All
							</Tabs.Tab>
							<Tabs.Tab
								value='comments'
								rightSection={
									unreadCommentNotificationsCount ? (
										<Badge
											w={16}
											h={16}
											sx={{ pointerEvents: 'none' }}
											variant='filled'
											size='sm'
											p={0}
											color='grape'
										>
											{unreadCommentNotificationsCount}
										</Badge>
									) : null
								}
							>
								💬 Comments
							</Tabs.Tab>
							<Tabs.Tab
								value='likes'
								rightSection={
									unreadLikeNotificationsCount ? (
										<Badge
											w={16}
											h={16}
											sx={{ pointerEvents: 'none' }}
											variant='filled'
											size='sm'
											p={0}
											color='grape'
										>
											{unreadLikeNotificationsCount}
										</Badge>
									) : null
								}
							>
								💜 Likes
							</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value='all'>
							<FadeIn>
								{data &&
									data.notifications.map(notification => (
										<NotificationItem
											key={`notif-${notification.id}`}
											notification={notification}
										/>
									))}
								{isLoading && <LoadingTab />}
								{!isLoading && !totalCount && <EmptyTab />}
							</FadeIn>
						</Tabs.Panel>
						<Tabs.Panel value='comments'>
							<FadeIn>
								{commentNotifications &&
									commentNotifications.map(notification => (
										<NotificationItem
											key={`notif-${notification.id}`}
											notification={notification}
										/>
									))}
								{isLoading && <LoadingTab />}
								{!isLoading && !commentNotificationsCount && <EmptyTab />}
							</FadeIn>
						</Tabs.Panel>
						<Tabs.Panel value='likes'>
							<FadeIn>
								{likeNotifications &&
									likeNotifications.map(notification => (
										<NotificationItem
											key={`notif-${notification.id}`}
											notification={notification}
										/>
									))}
								{isLoading && <LoadingTab />}
								{!isLoading && !likeNotificationsCount && <EmptyTab />}
							</FadeIn>
						</Tabs.Panel>
					</Tabs>
				</TabsWrapper>
			</Center>
		</>
	);
};
