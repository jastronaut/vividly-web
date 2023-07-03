import { Header } from '@mantine/core';
import styled from 'styled-components';
import { rem } from 'polished';
import { getRgba } from '@/components/utils/getRgba';

export const NavInner = styled.nav`
	display: flex;
	justify-content: right;
	transition: all 0.2s ease-in;

	@media screen and (max-width: 800px) {
		justify-content: space-between;

		#nav-settings {
			display: none;
		}
	}
`;
export const Navigation = styled.header<{ isHidden: boolean }>`
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	position: fixed;
	height: ${rem(50)};
	padding: ${rem(8)} ${rem(16)};

	background-color: ${props =>
		getRgba(props.theme.background.primary, 0.8, false)};

	transition: all 0.2s ease-in;

	@media screen and (max-width: 800px) {
		${props => (props.isHidden ? 'transform: translateY(100%);' : '')}
	}

	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	-o-backdrop-filter: blur(12px);
	-moz-backdrop-filter: blur(12px);

	@media screen and (min-width: 801px) {
		border-bottom: ${rem(1)} solid ${props => props.theme.background.secondary};
	}

	@media screen and (max-width: 800px) {
		top: unset;
		bottom: 0;
		border-top: ${rem(1)} solid ${props => props.theme.background.secondary};
		padding: ${rem(8)} ${rem(64)};
	}
`;

export const NavItem = styled.div`
	border-radius: ${rem(4)};
	:hover {
		cursor: pointer;
		background-color: ${props => props.theme.accent}50;
		transform: scale(1.1);
	}

	@media screen and (min-width: 801px) {
		margin-left: ${rem(16)};
	}
`;

export const PageContentContainer = styled.main<{ isNavHidden: boolean }>`
	margin-top: ${rem(50)};
	margin-left: ${rem(64)};
	margin-right: ${rem(64)};

	@media screen and (max-width: 800px) {
		margin-left: 0;
		margin-right: 0;
		margin-top: 0;
		margin-bottom: ${rem(25)};
	}

	@media screen and (min-width: 1000px) {
		margin-left: ${rem(128)};
		margin-right: ${rem(128)};
	}

	@media screen and (min-width: 1200px) {
		margin-left: ${rem(256)};
		margin-right: ${rem(256)};
	}
`;

export const NavButton = styled.div`
	padding: ${rem(8)} ${rem(16)};
	display: flex;
	border-radius: ${rem(4)};
	:hover {
		cursor: pointer;
	}
`;

export const NavbarInner = styled.div`
	a,
	a:visited {
		color: ${props => props.theme.text.primary};
	}
`;

export const HeaderStyled = styled(Header)`
	background-color: ${props =>
		getRgba(props.theme.background.primary, 0.6, false)};

	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	-o-backdrop-filter: blur(12px);
	-moz-backdrop-filter: blur(12px);
`;
