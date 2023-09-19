import styled from 'styled-components';
import { rem } from 'polished';

import { QuoteBlock as QuoteBlockType } from '@/types/post';
import { renderPostContent } from '../Content';
import { usePostDrawerContext } from '../../contexts/PostDrawerContext';

const Container = styled.div`
	border: ${rem(1)} solid ${props => props.theme.border.secondary};
	border-radius: ${rem(4)};
	margin: ${rem(4)} 0;
	width: 95%;

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

export const QuoteBlock = (props: QuoteBlockType) => {
	const { setPostId } = usePostDrawerContext();
	return (
		<Container onClick={() => setPostId(props.postId)}>
			<blockquote>
				{renderPostContent(props.preview, `quote-${props.postId}`)}
			</blockquote>
		</Container>
	);
};
