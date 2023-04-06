import { useState } from 'react';
import {
	AppShell,
	Navbar,
	Header,
	Footer,
	Aside,
	Text,
	MediaQuery,
	Burger,
	useMantineTheme,
} from '@mantine/core';
import styled from 'styled-components';
import { parseToRgb, rgba, darken } from 'polished';

const getRgba = (color: string, opacity: number, isDarkened: boolean) => {
	const rgb = parseToRgb(isDarkened ? darken(0.1, color) : color);
	return `${rgba(rgb.red, rgb.green, rgb.blue, opacity)}`;
};

type Props = {
	children: React.ReactNode;
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
		>
			{props.children}
		</AppShell>
	);
}
