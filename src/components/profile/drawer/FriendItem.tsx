import { useState } from 'react';
import {
	Flex,
	Space,
	Menu,
	ActionIcon,
	Text,
	Container,
	Badge,
	Box,
} from '@mantine/core';
import {
	IconDots,
	IconUserMinus,
	IconStarFilled,
	IconStarOff,
	IconStar,
} from '@tabler/icons-react';
import Link from 'next/link';
import styled from 'styled-components';
import { rem } from 'polished';
import { useRouter } from 'next/router';

import { Friend } from '@/types/user';
import { Avatar } from '@/components/Avatar';
import { MenuContainer } from '@/components/post/comments/styles';
import { TextContainer } from '@/components/activity/requests/styles';
import { Wrapper } from '@/components/activity/requests/styles';
import { DismissWarningModal } from '@/components/DismissWarningModal';

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
	unfriendUser: (id: number) => void;
	toggleFavorite: (id: number, isFavorite: boolean) => void;
};

export const FriendItem = (props: FriendItemProps) => {
	const [warningModalOpen, setWarningModalOpen] = useState(false);
	const { friendshipInfo } = props;
	const { friend } = friendshipInfo;
	const router = useRouter();

	const { isFavorite } = friendshipInfo;

	return (
		<>
			<DismissWarningModal
				isOpen={warningModalOpen}
				message={'Are you sure you want to unfriend this user?'}
				onNo={() => setWarningModalOpen(false)}
				onYes={() => props.unfriendUser(friend.id)}
			/>
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
									{isFavorite && (
										<Badge
											sx={{ marginLeft: '5px', border: 'none' }}
											color='yellow'
											size='xs'
											variant='outline'
										>
											<IconStarFilled size={14} />
										</Badge>
									)}
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
									icon={
										isFavorite ? (
											<IconStarOff size={14} />
										) : (
											<IconStar size={14} />
										)
									}
									onClick={() => props.toggleFavorite(friend.id, isFavorite)}
								>
									{isFavorite ? 'Unfavorite' : 'Favorite'}
								</Menu.Item>
								<Menu.Item
									color='red'
									icon={<IconUserMinus size={14} />}
									onClick={() => setWarningModalOpen(true)}
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
