import { useEffect } from 'react';
import useSWR from 'swr';
import { Tabs, Center, Title, Space } from '@mantine/core';

import { NotificationItem } from './NotificationItem';
import { TabsWrapper } from '../requests/_style';
import { showAndLogErrorNotification } from '@/showerror';
import { NotificationsResponse } from '@/types/api';
import { fetchWithToken } from '@/utils';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { NotificationType } from '@/types/notification';

export const NotificationTabs = () => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const { data, isLoading, error, mutate } = useSWR<NotificationsResponse>(
		[token ? `http://localhost:1337/v0/notifications` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const notificationsCount = data?.notifications.length;

	useEffect(() => {
		if (error) {
			showAndLogErrorNotification(`Couldn't load friend requests`, error);
		}
	}, [error]);

	return (
		<>
			<Center>
				<TabsWrapper>
					<Title order={3}>Notifications</Title>
					<Space h='xl' />
					<Tabs color='grape' defaultValue='all'>
						<Tabs.List>
							<Tabs.Tab value='all'>All</Tabs.Tab>
							<Tabs.Tab value='comments'>Comments</Tabs.Tab>
							<Tabs.Tab value='likes'>Likes</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value='all'>
							{data &&
								data.notifications.map(notification => (
									<NotificationItem
										key={`notif-${notification.id}`}
										notification={notification}
									/>
								))}
						</Tabs.Panel>
						<Tabs.Panel value='comments'>
							{data &&
								data.notifications
									.filter(
										notification =>
											notification.body.type === NotificationType.COMMENT
									)
									.map(notification => (
										<NotificationItem
											key={`notif-${notification.id}`}
											notification={notification}
										/>
									))}
						</Tabs.Panel>
						<Tabs.Panel value='likes'>
							{data &&
								data.notifications
									.filter(
										notification =>
											notification.body.type === NotificationType.POST_LIKE
									)
									.map(notification => (
										<NotificationItem
											key={`notif-${notification.id}`}
											notification={notification}
										/>
									))}
						</Tabs.Panel>
					</Tabs>
				</TabsWrapper>
			</Center>
		</>
	);
};
