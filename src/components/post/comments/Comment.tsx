import { Flex, Space, Text, Menu, ActionIcon } from '@mantine/core';
import { IconDots, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';

import { Comment as CommentType } from '@/types/post';
import { MenuContainer, Wrapper, TextContainer } from './styles';
import { Avatar } from '@/components/common/Avatar';
import { Linkified } from '@/components/common/Linkified';

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
						<Link
							href={{
								pathname: '/profile/[id]',
								query: { id: props.author.id },
							}}
							onClick={props.onClickLink}
						>
							<Avatar
								src={props.author.avatarSrc}
								size={30}
								alt={`${props.author.username}'s avatar`}
							/>
						</Link>
						<TextContainer>
							<Flex>
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
								<Text
									c='dimmed'
									fz='sm'
									sx={{
										marginLeft: '4px',
									}}
								>
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
							</Flex>
							<Text className='comment-content' onClick={props.onClickComment}>
								<Linkified>{props.content}</Linkified>
							</Text>
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
