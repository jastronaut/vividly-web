import { Flex, Space, Text, Menu, ActionIcon } from '@mantine/core';
import { IconDots, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';

import { Comment as CommentType } from '@/types/post';
import { MenuContainer, Wrapper, TextContainer } from './styles';
import { Avatar } from '@/components/common/Avatar';

type CommentProps = {
	onDelete: () => void;
	onClickLink: () => void;
	canDelete: boolean;
	onClickComment?: () => void;
} & CommentType;

export const Comment = (props: CommentProps) => {
	return (
		<>
			<Wrapper>
				<Flex style={{ justifyContent: 'space-between' }}>
					<Flex>
						<Avatar
							src={props.author.avatarSrc}
							size={30}
							alt={`${props.author.username}'s avatar`}
						/>
						<TextContainer>
							<Text fw={700} fz='sm'>
								<Link
									href={{
										pathname: '/profile/[id]',
										query: { id: props.author.id },
									}}
									onClick={props.onClickLink}
								>
									{props.author.name}
								</Link>
							</Text>
							<Text c='dimmed' fz='sm'>
								<Link
									href={{
										pathname: '/profile/[id]',
										query: { id: props.author.id },
									}}
									onClick={props.onClickLink}
								>
									{` @`}
									{props.author.username}
								</Link>
							</Text>
							<Text onClick={props.onClickComment}>{props.content}</Text>
						</TextContainer>
					</Flex>
					{props.canDelete && (
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
					)}
				</Flex>
			</Wrapper>
			<Space h='sm' />
		</>
	);
};
