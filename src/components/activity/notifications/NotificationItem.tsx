import { Flex, Text } from '@mantine/core';
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
import { Avatar } from '@/components/common/Avatar';
import { usePostDrawerContext } from '@/components/contexts/PostDrawerContext';

function getNotificationActionMessage(notification: NotificationBody) {
	switch (notification.type) {
		case NotificationType.ANNOUNCEMENT:
			return 'announced something';
		case NotificationType.POST_LIKE:
			return 'liked your post';
		case NotificationType.POST_MENTION:
			return 'mentioned you in a post';
		case NotificationType.COMMENT_MENTION:
			return 'mentioned you in a comment';
		default:
			return '';
	}
}

function getNotificationContentPreview(notification: NotificationBody) {
	switch (notification.type) {
		case NotificationType.POST_LIKE:
		case NotificationType.COMMENT:
		case NotificationType.POST_MENTION:
		case NotificationType.COMMENT_MENTION:
			return getBlockPreview(notification.post.block);
		default:
			return '';
	}
}

const WrapperStyled = styled(Wrapper)<{ isUnread: boolean }>`
	:hover {
		cursor: pointer;
	}

	@media (max-width: 800px) {
		padding: ${rem(10)};
		min-width: ${rem(295)};
	}

	${props =>
		!props.isUnread &&
		`
		opacity: 0.7;
	`}

	:hover {
		opacity: 1;
	}
`;

interface Props {
	notification: Notification;
}

export const NotificationItem = (props: Props) => {
	const { createdTime, body, sender, isUnread } = props.notification;
	const { setPostId } = usePostDrawerContext();

	const timestamp = getPostTime(createdTime);
	const notificationActionMessage = getNotificationActionMessage(body);
	const notificationContentPreview = getNotificationContentPreview(body);

	if (body.type === NotificationType.ANNOUNCEMENT) {
		return <div>lol</div>;
	}

	return (
		<WrapperStyled
			isUnread={isUnread}
			withHover
			onClick={() => setPostId(body.post.id)}
		>
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
	);
};
