import { useEffect } from 'react';
import {
	Tabs,
	Center,
	Title,
	Space,
	Badge,
	Button,
	Stack,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { NotificationItem } from './NotificationItem';
import { PageWrapper } from '../requests/_style';
import { showAndLogErrorNotification } from '@/showerror';
import { DefaultResponse } from '@/types/api';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { NotificationType } from '@/types/notification';
import { EmptyTab, LoadingTab } from '../TabStates';
import { makeApiCall } from '@/utils';
import { FadeIn } from '@/styles/Animations';
import { useNotificationsContext } from '@/components/utils/NotificationsContext';
import { useFriendRequestsContext } from '@/components/utils/FriendRequestsContext';

export const NotificationTabs = () => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const { isLoading, notifications, loadMore, error, refetch, hasMore } =
		useNotificationsContext();
	const { numRequests } = useFriendRequestsContext();

	const unreadCount = notifications.filter(
		notification => notification.isUnread
	);
	const totalNotificationsCount = notifications.length;

	const likeNotifications = notifications.filter(
		notification => notification.body.type === NotificationType.POST_LIKE
	);

	const commentNotifications = notifications.filter(
		notification => notification.body.type === NotificationType.COMMENT
	);

	const mentionNotifications = notifications.filter(
		notification => notification.body.type === NotificationType.MENTION
	);

	const unreadNotificationsCount = notifications.filter(
		notification => notification.isUnread
	).length;

	const unreadLikeNotificationsCount = likeNotifications.filter(
		notification => notification.isUnread
	).length;

	const unreadCommentNotificationsCount = commentNotifications.filter(
		notification => notification.isUnread
	).length;

	const unreadMentionNotificationsCount = mentionNotifications.filter(
		notification => notification.isUnread
	).length;

	useEffect(() => {
		if (error) {
			showAndLogErrorNotification(`Couldn't load friend requests`, error);
		}
	}, [error]);

	useEffect(() => {
		refetch();
	}, []);

	useEffect(() => {
		const markNotificationsAsRead = async () => {
			if (!token || !unreadCount) return;
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
	}, [unreadCount]);

	return (
		<>
			<PageWrapper>
				<Title order={3}>Notifications</Title>
				<Space h='xl' />
				<Tabs color='grape' defaultValue='all'>
					<Tabs.List>
						<Tabs.Tab
							value='all'
							rightSection={
								unreadNotificationsCount ? (
									<Badge
										w={16}
										h={16}
										sx={{ pointerEvents: 'none' }}
										variant='filled'
										size='sm'
										p={0}
										color='grape'
									>
										{unreadNotificationsCount >= 50
											? '50+'
											: unreadNotificationsCount}
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
							value='mentions'
							rightSection={
								unreadMentionNotificationsCount ? (
									<Badge
										w={16}
										h={16}
										sx={{ pointerEvents: 'none' }}
										variant='filled'
										size='sm'
										p={0}
										color='grape'
									>
										{unreadMentionNotificationsCount}
									</Badge>
								) : null
							}
						>
							🕸️ Mentions
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
							{notifications.map(notif => (
								<NotificationItem
									key={`notif-${notif.id}`}
									notification={notif}
								/>
							))}
							{isLoading && <LoadingTab />}
							{!isLoading && !totalNotificationsCount && <EmptyTab />}
						</FadeIn>
					</Tabs.Panel>
					<Tabs.Panel value='comments'>
						<FadeIn>
							{commentNotifications.map(notification => (
								<NotificationItem
									key={`notif-${notification.id}`}
									notification={notification}
								/>
							))}
							{isLoading && <LoadingTab />}
							{!isLoading && commentNotifications.length < 1 ? (
								<EmptyTab />
							) : null}
						</FadeIn>
					</Tabs.Panel>
					<Tabs.Panel value='mentions'>
						<FadeIn>
							{mentionNotifications.map(notification => (
								<NotificationItem
									key={`notif-${notification.id}`}
									notification={notification}
								/>
							))}
							{isLoading && <LoadingTab />}
							{!isLoading && mentionNotifications.length < 1 ? (
								<EmptyTab />
							) : null}
						</FadeIn>
					</Tabs.Panel>
					<Tabs.Panel value='likes'>
						<FadeIn>
							{likeNotifications.map(notification => (
								<NotificationItem
									key={`notif-${notification.id}`}
									notification={notification}
								/>
							))}
							{isLoading && <LoadingTab />}
							{!isLoading && likeNotifications.length < 1 ? <EmptyTab /> : null}
						</FadeIn>
					</Tabs.Panel>
				</Tabs>
				<Space h='md' />
				<Center>
					<Stack spacing='xs'>
						{hasMore && (
							<>
								<Button onClick={loadMore}>Load more</Button>
								<Space h='sm' />
							</>
						)}
						<Link href='/friend-requests'>
							<Button
								component='span'
								rightIcon={<IconArrowRight />}
								variant='outline'
							>
								{`Manage friend requests ${
									numRequests > 0 ? `(${numRequests})` : ''
								}`}
							</Button>
						</Link>
					</Stack>
				</Center>
			</PageWrapper>
		</>
	);
};
