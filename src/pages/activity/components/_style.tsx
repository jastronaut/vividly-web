import styled from 'styled-components';
import { rem } from 'polished';
import { Tabs as MTabs } from '@mantine/core';

export const TabsWrapper = styled.div`
	background: ${props => props.theme.background.primary};
	color: ${props => props.theme.text.primary};
	padding: ${rem(16)} ${rem(24)};
	margin: ${rem(16)};
	border-radius: ${rem(8)};

	.mantine-Tabs-tabLabel {
		font-family: Montserrat;
	}

	@media screen and (max-width: 800px) {
		padding: ${rem(16)} ${rem(16)};
	}
`;

export const Tabs = styled(MTabs)`
	.mantine-Tabs-tabControl.mantine-Tabs-pills.mantine-Group-child:hover
		.mantine-Tabs-tabLabel {
		color: #eee;
	}

	.mantine-Tabs-tabControl.mantine-Tabs-pills:hover {
		background-color: ${props => props.theme.accent};
		transition: 0.25s ease background-color;
	}

	.mantine-Tabs-tabInner:hover {
		color: ${props => props.theme.accent};
	}

	.mantine-Tabs-tabActive {
		background-color: initial;
		background-color: ${props => props.theme.accent};
	}

	.mantine-Tabs-tabActive .mantine-Tabs-tabInner .mantine-Tabs-tabLabel {
		color: #fff;
	}
`;
