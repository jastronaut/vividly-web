import { Flex, Group } from '@mantine/core';
import styled from 'styled-components';
import { rem } from 'polished';

export const TextContainer = styled.div`
	padding-left: ${rem(8)};
	flex: 1;
`;

export const Wrapper = styled.div<{ withHover?: boolean }>`
	padding: ${rem(16)} ${rem(24)};
	border-bottom: 1px solid ${props => props.theme.background.secondary};

	a,
	a:visited {
		color: unset;
	}

	${props =>
		props.withHover &&
		`
	:hover {
		background: ${props.theme.background.secondary};
	}	`}

	@media screen and (max-width: 800px) {
		padding: ${rem(16)} ${rem(16)};
	}
`;

export const ActionsContainer = styled(Group)`
	/* align-self: flex-start; */
	@media screen and (max-width: 800px) {
		padding-top: ${rem(8)};
		/* padding-left: ${rem(52)}; */
	}
`;

export const LeftContent = styled(Flex)`
	max-width: 80%;
	cursor: pointer;
	@media screen and (max-width: 800px) {
		max-width: 100%;
	}
`;
