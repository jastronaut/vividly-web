import styled from 'styled-components';
import { rem } from 'polished';
import { Textarea } from '@mantine/core';

export const AllComments = styled.div`
	margin-top: ${rem(8)};
	@media screen and (min-width: 600px) {
		max-height: ${rem(500)};
		overflow: scroll;
	}
`;

export const AddCommentContainer = styled.div`
	padding-bottom: 0;
	width: 100%;
	background: ${props => props.theme.background.primary};
	flex: 0 1 auto;
`;

export const CommentTextArea = styled(Textarea)`
	margin-top: ${rem(16)};
	margin-bottom: ${rem(8)};

	.mantine-Textarea-input {
		font-family: Lato;
		border-color: ${props => props.theme.border.secondary};
	}

	.mantine-Textarea-input:focus-within {
		border-color: ${props => props.theme.border.primary};
	}
`;
