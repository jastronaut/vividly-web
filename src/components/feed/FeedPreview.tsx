import { Flex, Text, Badge, Group, Skeleton } from '@mantine/core';
import styled from 'styled-components';
import { rem } from 'polished';
import { IconPointFilled } from '@tabler/icons-react';

import { FeedFriendship } from '@/types/feed';
import { DEFAULT_AVATAR } from '@/constants';
import { getBlockPreview } from '../utils/getBlockPreview';
import { getPostTime } from '../utils/time';

import { VividlyItem } from '@/components/common/VividlyItem';
import { TextContainer } from '@/components/activity/requests/styles';
import { FavoriteBadge } from '@/components/common/FavoriteBadge';
import { Avatar } from '@/components/common/Avatar';

const WrapperStyled = styled(VividlyItem).attrs({ $withHover: false })<{
	$isUnread?: boolean;
}>`
	@media (max-width: 800px) {
		padding: ${rem(10)};
		min-width: ${rem(295)};
	}
	/* ${props => !props.$isUnread && `opacity: 0.5;`} */

	.mantine-Text-root {
		line-height: ${rem(18)};
	}
`;

export const FeedPreviewLoading = () => {
	return (
		<WrapperStyled $isUnread={false}>
			<Group>
				<div>
					<Skeleton height={50} circle />
				</div>
				<div style={{ minWidth: '50%' }}>
					<Skeleton height={16} width='75%' />
					<Skeleton height={12} mt={6} width='40%' />
					<Skeleton height={12} mt={6} width='55%' />
				</div>
			</Group>
		</WrapperStyled>
	);
};

export const UnreadBadge = () => {
	return (
		<Badge
			sx={{ border: 'none', flex: '0 0 28px', padding: 0, marginTop: rem(5) }}
			color='green'
			size='xs'
			variant='outline'
		>
			<IconPointFilled size={24} />
		</Badge>
	);
};

interface Props {
	item: FeedFriendship;
}

export const FeedPreview = (props: Props) => {
	const { item } = props;
	const { friend } = item;

	let post = null;
	if (friend.posts) {
		post = friend.posts[0];
	}

	const firstBlock = post && post.content.length > 0 ? post.content[0] : null;

	const blockPreview = getBlockPreview(firstBlock);

	let isUnread = false;

	if (post) {
		isUnread = post.createdTime > item.lastReadPostTime;
	}

	return (
		<WrapperStyled $isUnread={isUnread}>
			<Flex>
				<Avatar src={friend.avatarSrc || DEFAULT_AVATAR} alt={friend.name} />
				<TextContainer style={{ width: '100%' }}>
					<Text>
						<Text fw={700} component='span'>
							{friend.name}
						</Text>
						{item.isFavorite && <FavoriteBadge />}
						{` `}
					</Text>
					{post && (
						<Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
							<Flex sx={{ flex: 1 }}>
								{isUnread && <UnreadBadge />}
								<Text
									c='dimmed'
									sx={{
										overflow: 'hidden',
										textOverflow: 'ellipsis',
									}}
								>
									{blockPreview}
								</Text>
							</Flex>
							<Text c='dimmed' sx={{ marginLeft: rem(5) }}>
								{getPostTime(post.createdTime)}
							</Text>
						</Flex>
					)}
				</TextContainer>
			</Flex>
		</WrapperStyled>
	);
};
