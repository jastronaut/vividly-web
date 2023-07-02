import { useState } from 'react';
import { Flex, Space, Menu, ActionIcon, Text } from '@mantine/core';
import {
	IconDots,
	IconUserMinus,
	IconStarOff,
	IconStar,
} from '@tabler/icons-react';
import Link from 'next/link';
import styled from 'styled-components';
import { rem } from 'polished';
import { useRouter } from 'next/router';

import { Friend } from '@/types/user';
import { MenuContainer } from '@/components/post/comments/styles';
import { TextContainer } from '@/components/activity/requests/styles';
import { Wrapper } from '@/components/activity/requests/styles';
import { DismissWarningModal } from '@/components/DismissWarningModal';
import { FavoriteBadge } from '@/components/utils/FavoriteBadge';
import { Avatar } from '@/components/Avatar';

const TextStyled = styled(Text)`
	line-height: ${rem(16)};
`;

const WrapperStyled = styled(Wrapper)`
	border-bottom: none;
	border-radius: ${rem(8)};

	@media screen and (max-width: 800px) {
		padding: 0;
	}
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
						<Avatar
							src={friend.avatarSrc}
							size={30}
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
							<>
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
									{isFavorite && <FavoriteBadge />}
								</Link>
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
									<TextStyled c='dimmed' fz='sm'>
										{`@`}
										{friend.username}
									</TextStyled>
								</Link>
							</>
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
