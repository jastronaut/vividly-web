import styled from 'styled-components';
import { rem } from 'polished';
import { Textarea, Group } from '@mantine/core';

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

export const MenuContainer = styled(Group)`
	align-self: flex-start;
`;

export const Wrapper = styled.div`
	a {
		display: flex;
		color: unset;
	}

	a:hover .mantine-Text-root:first-of-type {
		text-decoration: underline;
		color: ${props => props.theme.accent};
	}
`;
