import styled from 'styled-components';
import { rem } from 'polished';

export const PageWrapper = styled.div`
	color: ${props => props.theme.text.primary};
	padding: ${rem(16)} ${rem(24)};
	margin: ${rem(16)};
	border-radius: ${rem(8)};
	width: ${rem(700)};

	.mantine-Tabs-panel {
		padding-top: 0;
	}

	@media screen and (max-width: 800px) {
		margin: ${rem(8)} 0 0;
		width: 100%;
		padding: ${rem(8)} ${rem(16)};
	}

	@media screen and (min-width: 1200px) {
		width: ${rem(900)};
	}
`;
