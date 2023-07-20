import styled from 'styled-components';
import { rem } from 'polished';

export const PageWrapper = styled.div`
	color: ${props => props.theme.text.primary};
	padding: ${rem(16)} ${rem(24)};
	margin: ${rem(16)};
	border-radius: ${rem(8)};
	width: 100%;

	.mantine-Tabs-panel {
		padding-top: 0;
	}

	@media screen and (max-width: 800px) {
		margin: ${rem(8)} 0 0;
		padding: ${rem(8)} ${rem(16)};
	}
`;
