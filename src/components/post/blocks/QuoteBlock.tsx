import styled from 'styled-components';
import { rem } from 'polished';
import { Text } from '@mantine/core';

import { QuoteBlock as QuoteBlockType } from '@/types/post';
import { renderPostContent } from '../Content';
import { usePostDrawerContext } from '../../contexts/PostDrawerContext';

const Container = styled.div`
	border: ${rem(1)} solid ${props => props.theme.border.secondary};
	border-radius: ${rem(4)};
	margin: ${rem(4)} 0;
	width: 95%;
	background-color: ${props => props.theme.background.primary};

	@media screen and (max-width: 800px) {
		margin: ${rem(2)} 0;
	}

	:hover {
		cursor: pointer;
		background-color: ${props => props.theme.accent}20;
	}

	blockquote {
		color: ${props => props.theme.text.muted};
	}

	img {
		opacity: 0.9;
	}
`;

type Props = {
	quoteDepth?: number;
} & QuoteBlockType;

export const QuoteBlock = (props: Props) => {
	const { setPostId } = usePostDrawerContext();
	const { quoteDepth = 1 } = props;

	const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		setPostId(props.postId);
	};

	if (quoteDepth > 3) {
		return <Text c='dimmed'>...</Text>;
	}

	return (
		<Container onClick={onClick}>
			<blockquote>
				{renderPostContent(
					props.preview,
					`quote-${props.postId}`,
					quoteDepth + 1
				)}
			</blockquote>
		</Container>
	);
};
