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
	IconFlag,
	IconBlockquote,
	IconEdit,
	IconCircle,
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
	onReport: () => void;
	onClickQuotePost: () => void;
	withQuotes: boolean;
	onEdit: () => void;
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
					size='md'
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
					size='md'
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
				<Menu withArrow position='bottom-end' offset={0}>
					<Menu.Target>
						<ActionIcon>
							<IconDots size={18} />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						{props.isOwnPost ? (
							<>
								{props.withQuotes && (
									<Menu.Item
										icon={<IconEdit size={16} />}
										onClick={props.onEdit}
									>
										Edit post
									</Menu.Item>
								)}
								<Menu.Item
									color='red'
									icon={<IconTrash size={16} />}
									onClick={props.onDelete}
								>
									Delete post
								</Menu.Item>
								<Tooltip
									label='Prevent or allow comments'
									withArrow
									position='bottom'
								>
									<Menu.Item
										icon={
											props.commentsDisabled ? (
												<IconCircle size={16} />
											) : (
												<IconBan size={16} />
											)
										}
										onClick={props.toggleDisableComments}
									>
										<span>
											{props.commentsDisabled
												? 'Enable comments'
												: 'Disable comments'}
										</span>
									</Menu.Item>
								</Tooltip>
								{props.withQuotes && (
									<Menu.Item
										icon={<IconBlockquote size={16} />}
										onClick={props.onClickQuotePost}
									>
										Quote post
									</Menu.Item>
								)}
							</>
						) : (
							<Menu.Item
								color='red'
								icon={<IconFlag size={16} />}
								onClick={props.onReport}
							>
								Report post
							</Menu.Item>
						)}
					</Menu.Dropdown>
				</Menu>
			</Group>
		</Wrapper>
	);
};
