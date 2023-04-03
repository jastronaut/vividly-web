import {
	ActionIcon,
	Flex,
	Avatar,
	Container,
	Text,
	Group,
	Skeleton,
} from '@mantine/core';
import { IconCheck, IconX, IconBan } from '@tabler/icons-react';
import styled from 'styled-components';
import { rem } from 'polished';

import { DEFAULT_AVATAR } from '@/constants';
import { User } from '@/types/user';

const FriendRequestTextContainer = styled.div`
	padding-left: ${rem(16)};
`;

const Wrapper = styled.div<{ withHover?: boolean }>`
	padding: ${rem(16)} ${rem(24)};
	border-bottom: 1px solid ${props => props.theme.background.secondary};

	${props =>
		props.withHover &&
		`
	:hover {
		background: ${props.theme.background.secondary};
	}	`}

	@media screen and (max-width: 800px) {
		padding: ${rem(16)} ${rem(16)};
	}
`;

const ActionsContainer = styled(Group)`
	/* align-self: flex-start; */
	@media screen and (max-width: 800px) {
		padding-top: ${rem(8)};
		padding-left: ${rem(52)};
	}
`;

const LeftContent = styled(Flex)`
	max-width: 80%;
	@media screen and (max-width: 800px) {
		max-width: 100%;
	}
`;

export type Props = {
	user: User;
	onClickAccept?: (() => void) | null;
	onClickBlock: () => void;
	onClickDecline: () => void;
};

export const FriendRequestItem = (props: Props) => {
	const { onClickAccept = null, user } = props;
	const { avatarSrc, username, name, bio } = user;
	return (
		<Wrapper withHover>
			<Flex wrap='wrap' style={{ justifyContent: 'space-between' }}>
				<LeftContent>
					<Avatar
						src={avatarSrc || DEFAULT_AVATAR}
						radius='xl'
						style={{ alignSelf: 'flex-start' }}
					/>
					<FriendRequestTextContainer>
						<Text fw={700}>{name}</Text>
						<Text c='dimmed'>@{username}</Text>
						<Text>{bio}</Text>
					</FriendRequestTextContainer>
				</LeftContent>
				<ActionsContainer spacing={'xs'}>
					{onClickAccept && (
						<ActionIcon
							variant='filled'
							color='green'
							onClick={onClickAccept}
							title='Accept friend request'
						>
							<IconCheck size={16} />
						</ActionIcon>
					)}
					<ActionIcon
						variant='filled'
						color='red'
						onClick={props.onClickDecline}
						title='Remove friend request'
					>
						<IconX size={16} />
					</ActionIcon>
					<ActionIcon
						variant='filled'
						color='gray'
						onClick={props.onClickBlock}
						title='Block user'
					>
						<IconBan size={16} />
					</ActionIcon>
				</ActionsContainer>
			</Flex>
		</Wrapper>
	);
};

export const LoadingItem = () => (
	<Wrapper>
		<Skeleton height={38} circle mb='xl' />
		<Skeleton height={8} mt={6} w='70%' radius='xl' />
		<Skeleton height={8} mt={6} w='70%' radius='xl' />
		<Skeleton height={8} mt={6} w='40%' radius='xl' />
	</Wrapper>
);
