import styled from 'styled-components';
import { rem } from 'polished';
import { Text } from '@mantine/core';

export const EditorContainer = styled.div`
	margin: 0 auto;
	max-width: ${rem(800)};
	padding: ${rem(16)} 0 ${rem(16)} ${rem(8)};
	background-color: ${props => props.theme.background.secondary};
	border-radius: ${rem(8)};
`;

export const MagicTextWrapper = styled.div`
	margin: ${rem(16)} 0;
	display: inline;
	padding: ${rem(8)} ${rem(12)};
	border-radius: ${rem(8)};
	background-color: ${props => props.theme.background.hover};
`;
