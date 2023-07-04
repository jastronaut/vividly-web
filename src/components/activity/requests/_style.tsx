import styled from 'styled-components';
import { rem } from 'polished';

export const TabsWrapper = styled.div`
	color: ${props => props.theme.text.primary};
	padding: ${rem(16)} ${rem(24)};
	margin: ${rem(16)};
	border-radius: ${rem(8)};
	width: ${rem(700)};

	.mantine-Tabs-panel {
		padding-top: 0;
	}

	@media screen and (max-width: 800px) {
		margin: ${rem(8)} 0;
		width: 100%;
	}

	@media screen and (min-width: 1200px) {
		width: ${rem(900)};
	}
`;
