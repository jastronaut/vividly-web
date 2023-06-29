import { Flex, Text } from '@mantine/core';
import Link from 'next/link';
import styled from 'styled-components';
import { rem } from 'polished';

import {
	Notification,
	NotificationType,
	NotificationBody,
} from '@/types/notification';

import { Wrapper, TextContainer } from '../requests/styles';
import { DEFAULT_AVATAR } from '@/constants';

import { getBlockPreview } from '@/components/utils/getBlockPreview';
import { Avatar } from '@/components/Avatar';

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
		case NotificationType.COMMENT:
			return getBlockPreview(notification.post.block);
		default:
			return '';
	}
}

const WrapperStyled = styled(Wrapper)`
	@media (max-width: 800px) {
		padding: ${rem(10)};
		min-width: ${rem(295)};
	}
`;

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
			<WrapperStyled withHover>
				<Flex>
					<Avatar
						src={notification.sender.avatarSrc || DEFAULT_AVATAR}
						alt={`${notification.sender.name}'s avatar`}
						size={30}
					/>
					<TextContainer>
						<Text>
							<Text fw={700} component='span'>
								{notification.sender.name}
							</Text>
							{` `}
							{notificationActionMessage}
						</Text>
						{notification.body.type === NotificationType.COMMENT && (
							<Text>{notification.body.message}</Text>
						)}
						<Text c='dimmed'>{notificationContentPreview}</Text>
					</TextContainer>
				</Flex>
			</WrapperStyled>
		</Link>
	);
};
