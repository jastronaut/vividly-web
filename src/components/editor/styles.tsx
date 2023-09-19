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

	img {
		width: 90%;
	}
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
		margin: 0 ${rem(8)} ${rem(10)};
	}

	[data-slate-placeholder='true'] {
		position: unset !important;
	}
`;

export const NamesDropdownOption = styled.div<{ isHighlighted: boolean }>`
	display: flex;
	padding: ${rem(1)} ${rem(3)};
	border-radius: ${rem(3)};
	background-color: ${props =>
		props.isHighlighted ? props.theme.accent : 'transparent'};

	.friend-name {
		color: ${props =>
			props.isHighlighted ? '#fff' : props.theme.text.primary};
		margin-right: ${rem(2)};
	}

	.friend-username {
		color: ${props =>
			props.isHighlighted ? '#fff' : props.theme.text.lightest};
	}
`;

export const NamesDropdownContainer = styled.div`
	position: absolute;
	z-index: 1;
	padding: ${rem(3)};
	border-radius: ${rem(4)};
	box-shadow: 0 ${rem(1)} ${rem(5)} rgba(0, 0, 0, 0.2);
	visibility: visible;
	background-color: ${props => props.theme.background.primary};
`;
