import styled, { useTheme } from 'styled-components';
import { rem } from 'polished';
import {
	IconHeart,
	IconHeartFilled,
	IconMessageCircle2,
} from '@tabler/icons-react';
import { Group, Button, Text } from '@mantine/core';

import { getPostTime } from '../utils/time';

const Wrapper = styled.div`
	.mantine-Text-root {
		padding: 0 ${rem(10)};
		min-width: ${rem(20)};
		color: ${props => props.theme.text.lightest};
		font-size: ${rem(12)};
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
					size='xs'
					leftIcon={
						props.isLiked ? (
							<IconHeartFilled stroke={theme.accent} size={18} />
						) : (
							<IconHeart color={theme.text.lightest} size={18} />
						)
					}
					title='Like post'
				>
					{props.likeCount}
				</Button>
				<Button
					variant='subtle'
					color='green'
					radius='lg'
					size='xs'
					leftIcon={
						<IconMessageCircle2 color={theme.text.lightest} size={18} />
					}
					title='Comment on post'
				>
					{props.commentCount}
				</Button>
				<Text>—</Text>
				<Text>{getPostTime(props.timestamp)}</Text>
			</Group>
		</Wrapper>
	);
};
