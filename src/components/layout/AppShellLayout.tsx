import React, { useState } from 'react';
import {
	AppShell,
	Navbar,
	Header,
	Group,
	Text,
	Title,
	MediaQuery,
	Burger,
	useMantineTheme,
	UnstyledButton,
	Stack,
	ThemeIcon,
	Switch,
	Divider,
	Space,
	ActionIcon,
} from '@mantine/core';
import styled from 'styled-components';
import { parseToRgb, rgba, darken, rem } from 'polished';
import {
	IconUser,
	IconBellRinging,
	IconSettings,
	IconInfoSquareRounded,
	IconAddressBook,
	IconMoonStars,
	IconSun,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useVividlyTheme, ThemeName } from '@/styles/Theme';

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
		padding: ${rem(8)} ${rem(32)};
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

const NavInner = styled.nav`
	display: flex;
	justify-content: right;

	@media screen and (max-width: 800px) {
		justify-content: space-between;
	}
`;

const PageContentContainer = styled.main`
	margin-top: ${rem(50)};
	margin-left: ${rem(64)};
	margin-right: ${rem(64)};

	@media screen and (max-width: 800px) {
		margin-left: 0;
		margin-right: 0;
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

	const onClickChangeTheme = () => {
		setTheme(
			vividlyTheme === ThemeName.Light ? ThemeName.Dark : ThemeName.Light
		);
	};

	const [opened, setOpened] = useState(false);

	const NavContent = (
		<NavInner>
			<NavItem>
				<Link href={`/profile/${props.id}`} title='Profile'>
					<ActionIcon color='grape' variant='transparent'>
						<IconUser size={18} />
					</ActionIcon>
				</Link>
			</NavItem>
			<NavItem>
				<Link href='/feed' title='Feed'>
					<UnstyledButton>
						<ActionIcon color='grape' variant='transparent'>
							<IconAddressBook size={18} />
						</ActionIcon>
					</UnstyledButton>
				</Link>
			</NavItem>
			<NavItem>
				<Link href={`/activity`} title='Notifications'>
					<ActionIcon color='grape' variant='transparent'>
						<IconBellRinging size={18} />
					</ActionIcon>
				</Link>
			</NavItem>
			<NavItem>
				<Link href='/settings' title='Settings'>
					<ActionIcon color='grape' variant='transparent'>
						<IconSettings size={18} />
					</ActionIcon>
				</Link>
			</NavItem>
		</NavInner>
	);

	return (
		<>
			<Navigation>{NavContent}</Navigation>
			<PageContentContainer>{props.children} </PageContentContainer>
		</>
	);

	return (
		<AppShell
			styles={{
				main: {
					background:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			}}
			padding={0}
			navbarOffsetBreakpoint='sm'
			asideOffsetBreakpoint='sm'
			header={
				<HeaderStyled height={{ base: 50, md: 70 }} p='md'>
					<div
						style={{ display: 'flex', alignItems: 'center', height: '100%' }}
					>
						<MediaQuery largerThan='sm' styles={{ display: 'none' }}>
							<Burger
								opened={opened}
								onClick={() => setOpened(o => !o)}
								size='sm'
								color={theme.colors.gray[6]}
								mr='xl'
							/>
						</MediaQuery>
						<Title order={3}>🔮 Vividly</Title>
					</div>
				</HeaderStyled>
			}
			navbar={
				<Navbar
					p='md'
					hiddenBreakpoint='sm'
					hidden={!opened}
					width={{ sm: 200, lg: 300 }}
				>
					<NavbarInner>
						<Stack>
							<Navbar.Section>
								<Link href={`/profile/${props.id}`}>
									<NavButton>
										<Group>
											<ThemeIcon variant='light'>
												<IconUser size={18} />
											</ThemeIcon>
											<Text
												fw={pathname === `/profile/${props.id}` ? 700 : 200}
											>
												Profile
											</Text>
										</Group>
									</NavButton>
								</Link>
							</Navbar.Section>
							<Navbar.Section>
								<Link href='/feed'>
									<NavButton>
										<UnstyledButton>
											<Group>
												<ThemeIcon variant='light'>
													<IconAddressBook size={18} />
												</ThemeIcon>
												<Text fw={pathname === '/feed' ? 700 : 200}>Feed</Text>
											</Group>
										</UnstyledButton>
									</NavButton>
								</Link>
							</Navbar.Section>
							<Navbar.Section>
								<Link href={`/activity`}>
									<NavButton>
										<Group>
											<ThemeIcon variant='light'>
												<IconBellRinging size={18} />
											</ThemeIcon>
											<Text fw={pathname === '/activity' ? 700 : 200}>
												Activity
											</Text>
										</Group>
									</NavButton>
								</Link>
							</Navbar.Section>
							<Navbar.Section>
								<Link href='/settings'>
									<NavButton>
										<Group>
											<ThemeIcon variant='light'>
												<IconSettings size={18} />
											</ThemeIcon>
											<Text>Settings</Text>
										</Group>
									</NavButton>
								</Link>
							</Navbar.Section>
							<Navbar.Section>
								<Link href='/feedback'>
									<NavButton>
										<Group>
											<ThemeIcon variant='light'>
												<IconInfoSquareRounded size={18} />
											</ThemeIcon>
											<Text>Feedback</Text>
										</Group>
									</NavButton>
								</Link>
							</Navbar.Section>
							<Navbar.Section>
								<Divider />
								<Space h='md' />
								<Switch
									size='md'
									checked={vividlyTheme === ThemeName.Dark}
									onChange={onClickChangeTheme}
									offLabel={<IconSun size={16} stroke={2.5} />}
									onLabel={
										<IconMoonStars size={16} stroke={2.5} color='white' />
									}
									label='Toggle theme'
								/>
							</Navbar.Section>
						</Stack>
					</NavbarInner>
				</Navbar>
			}
		>
			{props.children}
		</AppShell>
	);
}
