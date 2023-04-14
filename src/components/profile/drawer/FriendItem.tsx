import { Flex, Space, Menu, ActionIcon, Text } from '@mantine/core';
import { IconDots, IconUserMinus } from '@tabler/icons-react';
import Link from 'next/link';
import styled from 'styled-components';
import { rem } from 'polished';
import { useRouter } from 'next/router';

import { Friend } from '@/types/user';
import { Avatar } from '@/components/Avatar';
import { MenuContainer } from '@/components/post/comments/styles';
import { TextContainer } from '@/components/activity/requests/styles';
import { Wrapper } from '@/components/activity/requests/styles';

const AvatarStyled = styled(Avatar)`
	transition: 0.15s ease opacity;
	:hover {
		cursor: pointer;
		opacity: 0.5;
	}
`;

const TextStyled = styled(Text)`
	line-height: ${rem(16)};
`;

const WrapperStyled = styled(Wrapper)`
	border-bottom: none;
	border-radius: ${rem(8)};
`;

type FriendItemProps = {
	closeDrawer: () => void;
	friendshipInfo: Friend;
	// unfriendUser: (id: string) => void;
};

export const FriendItem = (props: FriendItemProps) => {
	const { friendshipInfo } = props;
	const { friend } = friendshipInfo;
	const router = useRouter();

	return (
		<>
			<WrapperStyled withHover>
				<Flex sx={{ justifyContent: 'space-between', flexGrow: 1 }}>
					<Flex>
						<AvatarStyled
							src={friend.avatarSrc}
							width={45}
							height={45}
							size={45}
							alt={`${friend.username}'s avatar`}
							onClick={() => {
								props.closeDrawer();
								router.push({
									pathname: '/profile/[id]',
									query: { id: friend.id },
								});
							}}
						/>
						<TextContainer>
							<Flex>
								<Link
									href={{
										pathname: '/profile/[id]',
										query: { id: friend.id },
									}}
									onClick={() => {
										props.closeDrawer();
									}}
									style={{ display: 'flex' }}
								>
									{/* @ts-ignore */}
									<TextStyled fw={700}>{friend.name}</TextStyled>
									{/* @ts-ignore */}
									<TextStyled c='dimmed' style={{ marginLeft: '5px' }}>
										{` @`}
										{friend.username}
									</TextStyled>
								</Link>
							</Flex>
							{friend.bio ? (
								<Text>{friend.bio}</Text>
							) : (
								<Text fs='italic' c='dimmed'>
									No bio yet
								</Text>
							)}
						</TextContainer>
					</Flex>
					<MenuContainer spacing={'xs'}>
						<Menu position='bottom-end' withArrow offset={0}>
							<Menu.Target>
								<ActionIcon aria-label='Manage friendship'>
									<IconDots size={14} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									color='red'
									icon={<IconUserMinus size={14} />}
									// onClick={props.onDelete}
								>
									Unfriend
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</MenuContainer>
				</Flex>
			</WrapperStyled>
			<Space h='sm' />
		</>
	);
};
