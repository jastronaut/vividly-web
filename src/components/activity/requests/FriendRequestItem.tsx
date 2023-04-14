import { ActionIcon, Flex, Text } from '@mantine/core';
import { IconCheck, IconX, IconBan } from '@tabler/icons-react';
import { useRouter } from 'next/router';

import {
	Wrapper,
	TextContainer,
	ActionsContainer,
	LeftContent,
} from './styles';
import { DEFAULT_AVATAR } from '@/constants';
import { User } from '@/types/user';
import { Avatar } from '@/components/Avatar';

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
		<Wrapper withHover>
			<Flex wrap='wrap' style={{ justifyContent: 'space-between' }}>
				<LeftContent>
					<Avatar
						src={avatarSrc || DEFAULT_AVATAR}
						style={{ alignSelf: 'flex-start' }}
						onClick={() => router.push(profileLink)}
						width={40}
						height={40}
						size={40}
						alt={`${username}'s avatar`}
					/>
					<TextContainer>
						<Text span fw={700}>
							{name}
						</Text>
						{` `}
						<Text span c='dimmed'>
							@{username}
						</Text>
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
