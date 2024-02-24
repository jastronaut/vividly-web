import styled from 'styled-components';
import { rem } from 'polished';

export const CommentsSection = styled.div`
	margin: ${rem(8)} ${rem(16)};

	@media screen and (max-width: 800px) {
		margin: ${rem(8)} ${rem(8)};
	}
`;

export const PostSection = styled.div`
	img {
		width: 100%;
	}
`;
