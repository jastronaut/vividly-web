import { ActionIcon, Tooltip, Text } from '@mantine/core';
import { IconCheck, IconX, IconBan } from '@tabler/icons-react';
import { useRouter } from 'next/router';

import { WrapperStyled, TextContainer, ActionsContainer } from './styles';
import { DEFAULT_AVATAR } from '@/constants';
import { User } from '@/types/user';
import { Avatar } from '@/components/common/Avatar';
import Link from 'next/link';

export type Props = {
	user: User;
	onClickAccept?: (() => void) | null;
	onClickBlock: () => void;
	onClickDecline: () => void;
};

export const FriendRequestItem = (props: Props) => {
	const { onClickAccept = null, user } = props;
	const { avatarSrc, username, name, bio, id } = user;
	const router = useRouter();

	const profileLink = `/profile/${id}`;
	return (
		<WrapperStyled>
			<Avatar
				src={avatarSrc || DEFAULT_AVATAR}
				onClick={() => router.push(profileLink)}
				size={40}
				alt={`${username}'s avatar`}
			/>
			<TextContainer>
				<Text span fw={700}>
					<Link
						href={{
							pathname: '/profile/[id]',
							query: { id },
						}}
					>
						{name}
					</Link>
				</Text>
				{` `}
				<Text span c='dimmed'>
					<Link
						href={{
							pathname: '/profile/[id]',
							query: { id },
						}}
					>
						@{username}
					</Link>
				</Text>
				<Text>{bio}</Text>
			</TextContainer>
			<ActionsContainer spacing={'xs'}>
				{onClickAccept && (
					<Tooltip label='Accept friend request' position='bottom' withArrow>
						<ActionIcon
							variant='filled'
							color='green'
							onClick={onClickAccept}
							aria-label='Accept friend request'
						>
							<IconCheck size={16} />
						</ActionIcon>
					</Tooltip>
				)}

				<Tooltip label='Remove friend request' position='bottom' withArrow>
					<ActionIcon
						variant='filled'
						color='red'
						onClick={props.onClickDecline}
						aria-label='Remove friend request'
					>
						<IconX size={16} />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Block user' position='bottom' withArrow>
					<ActionIcon
						variant='filled'
						color='gray'
						onClick={props.onClickBlock}
						aria-label='Block user'
					>
						<IconBan size={16} />
					</ActionIcon>
				</Tooltip>
			</ActionsContainer>
		</WrapperStyled>
	);
};
