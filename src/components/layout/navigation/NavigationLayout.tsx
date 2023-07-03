import React, { useEffect, useState } from 'react';
import { useMantineTheme, ActionIcon } from '@mantine/core';
import styled from 'styled-components';
import {
	IconUser,
	IconBellRinging,
	IconSettings,
	IconAddressBook,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVividlyTheme, ThemeName } from '@/styles/Theme';
import { useCurUserContext } from '../../utils/CurUserContext';
import { NavInner, NavItem, Navigation, PageContentContainer } from './styles';

type Props = {
	children: React.ReactNode;
	id?: number;
};
export default function NavigationLayout(props: Props) {
	const theme = useMantineTheme();
	const pathname = usePathname();
	const { curUser, isLoading } = useCurUserContext();

	const [isNavHidden, setIsNavHidden] = useState(false);

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
			<Navigation isHidden={isNavHidden}>{NavContent}</Navigation>
			<PageContentContainer isNavHidden={isNavHidden}>
				{props.children}
			</PageContentContainer>
		</>
	);
}
