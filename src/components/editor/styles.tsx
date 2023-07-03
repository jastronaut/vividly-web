import styled from 'styled-components';
import { rem } from 'polished';

export const EditorContainer = styled.div`
	margin: 0 auto;
	width: 100%;
	padding: ${rem(8)} 0 ${rem(8)} ${rem(8)};
	background-color: ${props => props.theme.background.secondary};
	border-radius: ${rem(8)};
	overflow: scroll;

	min-height: ${rem(100)};
`;

export const MagicTextWrapper = styled.div`
	display: inline-block;
	padding: ${rem(8)} ${rem(12)};
	border-radius: ${rem(8)};
	background-color: ${props => props.theme.background.hover};
`;

export const InlineEditorWrapper = styled.div`
	margin: 0;
	@media screen and (max-width: 800px) {
		margin: 0 ${rem(8)};
	}
`;
