import styled, { useTheme } from 'styled-components';
import { rem } from 'polished';
import { IconHeart, IconMessageCircle2 } from '@tabler/icons-react';
import { Group, Button, Text } from '@mantine/core';

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
						<IconMessageCircle2 color={theme.text.lightest} size={18} />
					}
					title='Comment on post'
					onClick={props.onClickComment}
				>
					{props.commentCount}
				</Button>
				<Text>—</Text>
				<Text>{getPostTime(props.timestamp)}</Text>
			</Group>
		</Wrapper>
	);
};
