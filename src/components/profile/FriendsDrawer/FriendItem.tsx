import { useState } from 'react';
import { Flex, Indicator, Menu, ActionIcon, Text } from '@mantine/core';
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
import { VividlyItem } from '@/components/common/VividlyItem';
import { DismissWarningModal } from '@/components/common/DismissWarningModal';
import { Avatar } from '@/components/common/Avatar';

const TextStyled = styled(Text)`
	line-height: ${rem(16)};
	word-break: break-word;
	margin-bottom: ${rem(4)};
`;

const WrapperStyled = styled(VividlyItem).attrs({ $withHover: true })`
	border-radius: 0;

	@media screen and (max-width: 800px) {
		margin: ${rem(4)} ${rem(8)};
		padding: ${rem(8)} ${rem(16)};
	}

	@media screen and (max-width: 500px) {
		margin: ${rem(8)} ${rem(4)};
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
			<WrapperStyled>
				<Flex sx={{ justifyContent: 'space-between', flexGrow: 1 }}>
					<Flex>
						<Link
							href={{
								pathname: '/profile/[id]',
								query: { id: friend.id },
							}}
							onClick={() => {
								props.closeDrawer();
							}}
						>
							<Indicator
								inline
								label='⭐'
								size={16}
								disabled={!isFavorite}
								color='transparent'
								sx={{
									'.mantine-Indicator-indicator': { fontSize: rem(20) },
								}}
							>
								<Avatar
									src={friend.avatarSrc}
									size={35}
									alt={`${friend.username}'s avatar`}
									onClick={() => {
										props.closeDrawer();
										router.push({
											pathname: '/profile/[id]',
											query: { id: friend.id },
										});
									}}
								/>
							</Indicator>
						</Link>
						<TextContainer>
							<>
								<Text fw={700}>
									<Link
										href={{
											pathname: '/profile/[id]',
											query: { id: friend.id },
										}}
										onClick={() => {
											props.closeDrawer();
										}}
									>
										{friend.name}
									</Link>
								</Text>
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
									<TextStyled c='dimmed'>
										{`@`}
										{friend.username}
									</TextStyled>
								</Link>
							</>
							{friend.bio ? (
								<TextStyled>{friend.bio}</TextStyled>
							) : (
								<Text
									fs='italic'
									c='dimmed'
									sx={{
										lineHeight: '1.1',
									}}
								>
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
		</>
	);
};
