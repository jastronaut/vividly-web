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
import { getPostTime } from '@/components/utils/time';

import { getBlockPreview } from '@/components/utils/getBlockPreview';
import { Avatar } from '@/components/Avatar';

function getNotificationActionMessage(notification: NotificationBody) {
	switch (notification.type) {
		case NotificationType.ANNOUNCEMENT:
			return 'announced something';
		case NotificationType.POST_LIKE:
			return 'liked your post';
		case NotificationType.MENTION:
			return 'mentioned you in a post';
		default:
			return '';
	}
}

function getNotificationContentPreview(notification: NotificationBody) {
	switch (notification.type) {
		case NotificationType.POST_LIKE:
		case NotificationType.COMMENT:
		case NotificationType.MENTION:
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
	const { createdTime, body, sender } = props.notification;

	const timestamp = getPostTime(createdTime);
	const notificationActionMessage = getNotificationActionMessage(body);
	const notificationContentPreview = getNotificationContentPreview(body);

	const link =
		body.type === NotificationType.ANNOUNCEMENT
			? '/announcements'
			: `/post/${body.post.id}`;

	if (body.type === NotificationType.ANNOUNCEMENT) {
		return <div>lol</div>;
	}

	return (
		<Link href={link} style={{ color: 'unset' }}>
			<WrapperStyled withHover>
				<Flex>
					<Avatar
						src={sender.avatarSrc || DEFAULT_AVATAR}
						alt={`${sender.name}'s avatar`}
						size={30}
					/>
					<TextContainer>
						<Text fw={700} component='span'>
							{sender.name}
						</Text>
						{` `}
						{notificationActionMessage}
						{body.type === NotificationType.COMMENT && (
							<Text
								sx={{
									lineHeight: rem(20),
								}}
							>
								{body.message}
							</Text>
						)}
						<Text c='dimmed'>{notificationContentPreview}</Text>
					</TextContainer>
					<Text c='dimmed'>{timestamp}</Text>
				</Flex>
			</WrapperStyled>
		</Link>
	);
};
