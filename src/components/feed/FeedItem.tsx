import { Flex, Avatar, Text, Space } from '@mantine/core';
import Link from 'next/link';
import styled from 'styled-components';
import { rem } from 'polished';

import { FeedFriendship } from '@/types/feed';

import { Wrapper, TextContainer } from '@/components/activity/requests/styles';
import { DEFAULT_AVATAR } from '@/constants';
import { Block, BlockType } from '@/types/post';

function getBlockPreview(block: Block | null) {
	if (!block) return '';
	switch (block.type) {
		case BlockType.TEXT:
			return block.text;
		case BlockType.IMAGE:
			return 'Image';
		case BlockType.LINK:
			return block.url;
		case BlockType.MUSIC:
			return `🎧 ${block.music.title}`;
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
	item: FeedFriendship;
}

export const FeedItem = (props: Props) => {
	const { item } = props;
	const { friend } = item;
	let post = null;
	if (friend.posts) {
		post = friend.posts[0];
	}

	const firstBlock = post && post.content.length > 0 ? post.content[0] : null;

	const blockPreview = getBlockPreview(firstBlock);

	const link = `/profile/${friend.id}`;

	return (
		<Link href={link} style={{ color: 'unset' }}>
			<WrapperStyled withHover>
				<Flex>
					<Avatar
						src={friend.avatarSrc || DEFAULT_AVATAR}
						radius='xl'
						style={{ alignSelf: 'flex-start' }}
					/>
					<TextContainer>
						<Text>
							<Text fw={700} component='span'>
								{friend.name}
							</Text>
							{` `}
						</Text>
						<Text c='dimmed'>{blockPreview}</Text>
					</TextContainer>
				</Flex>
			</WrapperStyled>
		</Link>
	);
};
