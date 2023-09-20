import styled from 'styled-components';
import { rem } from 'polished';

export const EditorContainer = styled.div<{ isFullscreen: boolean }>`
	margin: 0 auto;
	width: 100%;
	padding: ${rem(8)} 0 ${rem(8)} ${rem(8)};
	background-color: ${props => props.theme.background.secondary};
	border-radius: ${rem(8)};
	overflow: scroll;
	min-height: ${rem(100)};

	@media screen and (min-width: 801px) {
		width: ${props => (props.isFullscreen ? '100%' : '50%')};
	}

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

export const InlineEditorWrapper = styled.div<{ isFullscreen: boolean }>`
	margin: 0;

	@media screen and (max-width: 800px) {
		margin: ${props => (props.isFullscreen ? 0 : `0 ${rem(8)} ${rem(10)}`)};
		width: ${props => (props.isFullscreen ? '100%' : 'auto')};
	}

	@media screen and (min-width: 801px) {
		height: ${props => (props.isFullscreen ? rem(800) : 'auto')};
		width: ${props => (props.isFullscreen ? rem(800) : 'auto')};
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

export const LocationSelectorContainer = styled.div`
	max-width: ${rem(400)};
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	margin-right: ${rem(8)};

	@media screen and (max-width: 800px) {
		width: 100%;
	}
`;

export const LocationSelectorFormContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

	@media screen and (max-width: 800px) {
		flex-direction: column;
		align-items: flex-start;
	}
`;

export const EditorSubmitButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;

	@media screen and (max-width: 800px) {
		margin-top: ${rem(16)};
	}
`;
