import React, { useState } from 'react';
import { Header, useMantineTheme, ActionIcon } from '@mantine/core';
import styled from 'styled-components';
import { parseToRgb, rgba, darken, rem } from 'polished';
import {
	IconUser,
	IconBellRinging,
	IconSettings,
	IconAddressBook,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

const NavInner = styled.nav`
	display: flex;
	justify-content: right;
	transition: all 0.2s ease-in;

	@media screen and (max-width: 800px) {
		justify-content: space-between;
	}
`;

import { useVividlyTheme, ThemeName } from '@/styles/Theme';
import { useCurUserContext } from '../utils/CurUserContext';

const Navigation = styled.header`
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	position: fixed;
	height: ${rem(50)};
	padding: ${rem(8)} ${rem(16)};

	background-color: ${props =>
		getRgba(props.theme.background.primary, 0.7, false)};

	transition: all 0.2s ease-in;

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

const NavItem = styled.div`
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

const PageContentContainer = styled.main`
	margin-top: ${rem(50)};
	margin-left: ${rem(64)};
	margin-right: ${rem(64)};

	@media screen and (max-width: 800px) {
		margin-left: 0;
		margin-right: 0;
		margin-top: 0;
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

const NavButton = styled.div`
	padding: ${rem(8)} ${rem(16)};
	display: flex;
	border-radius: ${rem(4)};
	:hover {
		cursor: pointer;
	}
`;

const NavbarInner = styled.div`
	a,
	a:visited {
		color: ${props => props.theme.text.primary};
	}
`;

const getRgba = (color: string, opacity: number, isDarkened: boolean) => {
	const rgb = parseToRgb(isDarkened ? darken(0.1, color) : color);
	return `${rgba(rgb.red, rgb.green, rgb.blue, opacity)}`;
};

type Props = {
	children: React.ReactNode;
	id?: number;
};

const HeaderStyled = styled(Header)`
	background-color: ${props =>
		getRgba(props.theme.background.primary, 0.6, false)};

	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	-o-backdrop-filter: blur(12px);
	-moz-backdrop-filter: blur(12px);
`;

export default function AppShellLayout(props: Props) {
	const theme = useMantineTheme();
	const { setTheme, theme: vividlyTheme } = useVividlyTheme();
	const pathname = usePathname();
	const { curUser } = useCurUserContext();

	const onClickChangeTheme = () => {
		setTheme(
			vividlyTheme === ThemeName.Light ? ThemeName.Dark : ThemeName.Light
		);
	};

	const [opened, setOpened] = useState(false);

	const NavContent = (
		<>
			<NavInner>
				<NavItem>
					<Link href={curUser.user ? `/profile/${curUser.user.id}` : ''}>
						<ActionIcon color='grape' variant='transparent' component='span'>
							<IconUser size={18} />
						</ActionIcon>
					</Link>
				</NavItem>
				<NavItem>
					<Link href='/feed'>
						<ActionIcon color='grape' variant='transparent' component='span'>
							<IconAddressBook size={18} />
						</ActionIcon>
					</Link>
				</NavItem>
				<NavItem>
					<Link href='/activity'>
						<ActionIcon color='grape' variant='transparent' component='span'>
							<IconBellRinging size={18} />
						</ActionIcon>
					</Link>
				</NavItem>
				<NavItem>
					<Link href='/settings'>
						<ActionIcon color='grape' variant='transparent' component='span'>
							<IconSettings size={18} />
						</ActionIcon>
					</Link>
				</NavItem>
			</NavInner>
		</>
	);

	return (
		<>
			<Navigation>{NavContent}</Navigation>
			<PageContentContainer>{props.children} </PageContentContainer>
		</>
	);
}
