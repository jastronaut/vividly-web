import { Flex, Avatar, Text, Space } from '@mantine/core';
import Link from 'next/link';

import {
	Notification,
	NotificationType,
	NotificationBody,
} from '@/types/notification';

import { Wrapper, TextContainer } from '../requests/styles';
import { DEFAULT_AVATAR } from '@/constants';

function getNotificationActionMessage(notification: NotificationBody) {
	switch (notification.type) {
		case NotificationType.ANNOUNCEMENT:
			return 'announced something';
		case NotificationType.POST_LIKE:
			return 'liked your post';
		case NotificationType.COMMENT:
			return 'commented on your post';
		default:
			return 'did something';
	}
}

function getNotificationContentPreview(notification: NotificationBody) {
	switch (notification.type) {
		case NotificationType.POST_LIKE:
			return 'post like';
		case NotificationType.COMMENT:
			return notification.message;
		default:
			return '';
	}
}

interface Props {
	notification: Notification;
}

export const NotificationItem = (props: Props) => {
	const { notification } = props;

	const notificationActionMessage = getNotificationActionMessage(
		notification.body
	);
	const notificationContentPreview = getNotificationContentPreview(
		notification.body
	);

	const link =
		notification.body.type === NotificationType.ANNOUNCEMENT
			? '/announcements'
			: `/post/${notification.body.post.id}`;

	if (notification.body.type === NotificationType.ANNOUNCEMENT) {
		return <div>lol</div>;
	}

	return (
		<Link href={link} style={{ color: 'unset' }}>
			<Wrapper withHover>
				<Flex>
					<Avatar
						src={notification.sender.avatarSrc || DEFAULT_AVATAR}
						radius='xl'
						style={{ alignSelf: 'flex-start' }}
					/>
					<TextContainer>
						<Flex wrap='wrap'>
							<Text fw={700}>{notification.sender.name}</Text>
							<Space w='xs' />
							<Text>
								{` `}
								{notificationActionMessage}
							</Text>
						</Flex>
						<Text>{notificationContentPreview}</Text>
					</TextContainer>
				</Flex>
			</Wrapper>
		</Link>
	);
};
