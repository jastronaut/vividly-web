import { ActionIcon, Flex, Avatar, Text, Skeleton } from '@mantine/core';
import { IconCheck, IconX, IconBan } from '@tabler/icons-react';

import {
	Wrapper,
	TextContainer,
	ActionsContainer,
	LeftContent,
} from './styles';
import { DEFAULT_AVATAR } from '@/constants';
import { User } from '@/types/user';

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
					<TextContainer>
						<Text fw={700}>{name}</Text>
						<Text c='dimmed'>@{username}</Text>
						<Text>{bio}</Text>
					</TextContainer>
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
