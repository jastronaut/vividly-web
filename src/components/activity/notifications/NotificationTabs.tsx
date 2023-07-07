import { useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
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

	const {
		data = [],
		isLoading,
		error,
		size,
		setSize,
	} = useSWRInfinite<NotificationsResponse>(
		(pageIndex: number, previousPageData: NotificationsResponse | null) => {
			// reached the end
			if (
				!token ||
				(previousPageData &&
					(!previousPageData.data ||
						!previousPageData.data.notifications.length ||
						!previousPageData.cursor))
			)
				return null;

			// first page, we don't have `previousPageData`
			if (pageIndex === 0 && !previousPageData)
				return [`${URL_PREFIX}/notifications`, token];

			// add the cursor to the API endpoint
			if (previousPageData)
				return [
					`${URL_PREFIX}/notifications?cursor=${previousPageData.cursor}`,
					token,
				];
			return null;
		},
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const totalUnreadCount = 1;
	const totalCount = 1;

	const lastPage = data.length > 0 ? data[data.length - 1] : null;
	const hasMorePosts = lastPage ? !!lastPage.cursor : false;

	const likeNotifications = data
		? data
				.map(page => page.data.notifications)
				.flat()
				.filter(
					notification => notification.body.type === NotificationType.POST_LIKE
				)
		: [];

	const commentNotifications = data
		? data
				.map(page => page.data.notifications)
				.flat()
				.filter(
					notification => notification.body.type === NotificationType.COMMENT
				)
		: [];

	const unreadNotificationsCount = data
		? data
				.map(page => page.data.notifications)
				.flat()
				.filter(notification => notification.isUnread).length
		: 0;

	const unreadLikeNotificationsCount = likeNotifications.filter(
		notification => notification.isUnread
	).length;

	const unreadCommentNotificationsCount = commentNotifications.filter(
		notification => notification.isUnread
	).length;

	const onClickLoadMore = () => setSize(size + 1);

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
										{unreadNotificationsCount}
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
							{data
								? data.map(page =>
										page.data.notifications.map(notification => (
											<NotificationItem
												key={`notif-${notification.id}`}
												notification={notification}
											/>
										))
								  )
								: null}
							{isLoading && <LoadingTab />}
							{!isLoading && !totalCount && <EmptyTab />}
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
						{hasMorePosts && (
							<>
								<Button onClick={onClickLoadMore}>Load more</Button>
								<Space h='sm' />
							</>
						)}
						<Link href='/friend-requests'>
							<Button
								component='span'
								rightIcon={<IconArrowRight />}
								variant='outline'
							>
								{'Friend requests'}
							</Button>
						</Link>
					</Stack>
				</Center>
			</PageWrapper>
		</>
	);
};
