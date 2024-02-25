import { Flex, Group } from '@mantine/core';
import styled from 'styled-components';
import { rem } from 'polished';
import { VividlyItem } from '@/components/common/VividlyItem';

export const TextContainer = styled.div`
	padding-left: ${rem(8)};
	flex: 1;
`;

export const Wrapper = styled.div<{ $withHover?: boolean }>`
	padding: ${rem(16)} ${rem(24)};
	border-bottom: 1px solid ${props => props.theme.background.secondary};

	a,
	a:visited {
		color: unset;
	}

	${props =>
		props.$withHover &&
		`
	&:hover {
		background: ${props.theme.background.secondary};
		transition: background 0.2s ease-in;
	}	`}

	@media screen and (max-width: 800px) {
		padding: ${rem(16)} ${rem(16)};
	}
`;

export const WrapperStyled = styled(VividlyItem).attrs({ $withHover: true })`
	display: grid;
	grid-template-columns: auto 1fr auto;
`;

export const ActionsContainer = styled(Group)`
	@media screen and (max-width: 800px) {
		padding-top: ${rem(8)};
	}

	@media screen and (max-width: 500px) {
		grid-column: 2 / 4;
	}
`;

export const LeftContent = styled(Flex)`
	max-width: 80%;
	cursor: pointer;
	@media screen and (max-width: 800px) {
		max-width: 100%;
	}
`;
