import React, { useState } from 'react';
import {
	AppShell,
	Navbar,
	Header,
	Group,
	Text,
	MediaQuery,
	Burger,
	useMantineTheme,
	UnstyledButton,
	Stack,
	ThemeIcon,
} from '@mantine/core';
import styled from 'styled-components';
import { parseToRgb, rgba, darken, rem } from 'polished';
import {
	IconUser,
	IconBellRinging,
	IconSettings,
	IconInfoSquareRounded,
	IconAddressBook,
} from '@tabler/icons-react';
import Link from 'next/link';

const NavButton = styled.div`
	padding: ${rem(8)} ${rem(16)};
	display: flex;
	border-radius: ${rem(4)};
	:hover {
		cursor: pointer;
		background-color: ${props => props.theme.background.hover};
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
	const [opened, setOpened] = useState(false);
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

						<Text>Application header</Text>
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
					<Text>Application navbar</Text>
					<Stack>
						<Navbar.Section>
							<Link href={`/profile/${props.id}`}>
								<NavButton>
									<Group>
										<ThemeIcon variant='light'>
											<IconUser size={18} />
										</ThemeIcon>
										<Text>Profile</Text>
									</Group>
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
										<Text>Activity</Text>
									</Group>
								</NavButton>
							</Link>
						</Navbar.Section>
						<Navbar.Section>
							<NavButton>
								<UnstyledButton>
									<Group>
										<ThemeIcon variant='light'>
											<IconSettings size={18} />
										</ThemeIcon>
										<Text>Settings</Text>
									</Group>
								</UnstyledButton>
							</NavButton>
						</Navbar.Section>
						<Navbar.Section>
							<NavButton>
								<UnstyledButton>
									<Group>
										<ThemeIcon variant='light'>
											<IconInfoSquareRounded size={18} />
										</ThemeIcon>
										<Text>Feedback</Text>
									</Group>
								</UnstyledButton>
							</NavButton>
						</Navbar.Section>
						<Navbar.Section>
							<NavButton>
								<UnstyledButton>
									<Group>
										<ThemeIcon variant='light'>
											<IconAddressBook size={18} />
										</ThemeIcon>
										<Text>Feed</Text>
									</Group>
								</UnstyledButton>
							</NavButton>
						</Navbar.Section>
					</Stack>
				</Navbar>
			}
		>
			{props.children}
		</AppShell>
	);
}
