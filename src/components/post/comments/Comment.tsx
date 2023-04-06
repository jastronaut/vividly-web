import { Flex, Space, Text, Avatar, Menu, ActionIcon } from '@mantine/core';
import { IconDots, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';

import { Comment as CommentType } from '@/types/post';
import { TextContainer } from '../../friends/styles';
import { MenuContainer, Wrapper } from './styles';

type CommentProps = {
	onDelete: () => void;
	onClickLink: () => void;
} & CommentType;

export const Comment = (props: CommentProps) => {
	return (
		<>
			<Wrapper>
				<Flex style={{ justifyContent: 'space-between' }}>
					<Flex>
						<Avatar src={props.author.avatarSrc} size='sm' radius='xl' />
						<TextContainer>
							<Flex>
								<Link
									href={{
										pathname: '/profile/[id]',
										query: { id: props.author.id },
									}}
									onClick={props.onClickLink}
								>
									<Text fw={700}>{props.author.name}</Text>
									<Text c='dimmed' style={{ marginLeft: '5px' }}>
										{` @`}
										{props.author.username}
									</Text>
								</Link>
							</Flex>
							<Text>{props.content}</Text>
						</TextContainer>
					</Flex>
					<MenuContainer spacing={'xs'}>
						<Menu position='bottom-end' withArrow offset={0}>
							<Menu.Target>
								<ActionIcon>
									<IconDots size={14} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									color='red'
									icon={<IconTrash size={14} />}
									onClick={props.onDelete}
								>
									Delete comment
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</MenuContainer>
				</Flex>
			</Wrapper>
			<Space h='sm' />
		</>
	);
};
