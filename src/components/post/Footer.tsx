import React from 'react';
import styled, { useTheme } from 'styled-components';
import { rem } from 'polished';
import {
	IconHeart,
	IconMessageCircle2,
	IconDots,
	IconTrash,
	IconBan,
	IconMessageCircleOff,
} from '@tabler/icons-react';
import { Group, Button, Text, Menu, ActionIcon, Tooltip } from '@mantine/core';

import { getPostTime } from '../utils/time';

const Wrapper = styled.div`
	.mantine-Text-root {
		padding: 0 ${rem(10)};
		min-width: ${rem(20)};
		color: ${props => props.theme.text.lightest};
	}

	.mantine-Button-label {
		color: ${props => props.theme.text.lightest};
		font-weight: initial;
	}
`;

export type FooterProps = {
	onClickLike: () => void;
	isLiked: boolean;
	likeCount: number;
	commentCount: number;
	onClickComment: () => void;
	timestamp: number;
	onDelete: () => void;
	isOwnPost: boolean;
	commentsDisabled: boolean;
	toggleDisableComments: () => void;
};

export const Footer = (props: FooterProps) => {
	const theme = useTheme();
	return (
		<Wrapper>
			<Group>
				<Button
					variant='subtle'
					color='pink'
					radius='lg'
					size='sm'
					leftIcon={
						props.isLiked ? (
							<IconHeart fill={theme.accent} color={theme.accent} size={18} />
						) : (
							<IconHeart color={theme.text.lightest} size={18} />
						)
					}
					title='Like post'
					onClick={props.onClickLike}
				>
					{props.likeCount}
				</Button>
				<Button
					variant='subtle'
					color='green'
					radius='lg'
					size='sm'
					leftIcon={
						props.commentsDisabled ? (
							<IconMessageCircleOff color={theme.text.lightest} size={18} />
						) : (
							<IconMessageCircle2 color={theme.text.lightest} size={18} />
						)
					}
					title='Comment on post'
					onClick={props.onClickComment}
				>
					{props.commentCount}
				</Button>
				<Text>—</Text>
				<Text>{getPostTime(props.timestamp)}</Text>
				{props.isOwnPost && (
					<Menu withArrow offset={0}>
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
								Delete post
							</Menu.Item>
							<Menu.Item
								icon={<IconBan size={14} />}
								onClick={props.toggleDisableComments}
							>
								<Tooltip label='Disable/enable comments' position='bottom'>
									<span>
										{props.commentsDisabled
											? 'Enable comments'
											: 'Disable comments'}
									</span>
								</Tooltip>
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				)}
			</Group>
		</Wrapper>
	);
};
