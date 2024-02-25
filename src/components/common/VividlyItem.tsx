import { rem } from 'polished';
import styled from 'styled-components';

export const VividlyItem = styled.div<{ $withHover?: boolean }>`
	padding: ${rem(16)} ${rem(24)};
	border-bottom: 1px solid ${props => props.theme.background.secondary};
	a,
	a:visited {
		color: unset;
	}

	${props =>
		props.$withHover &&
		`&:hover {
		background: ${props.theme.background.secondary};
		transition: background 0.2s ease-in;
		cursor: pointer;
	}`}

	@media screen and (max-width: 800px) {
		padding: ${rem(16)} ${rem(16)};
	}
`;
