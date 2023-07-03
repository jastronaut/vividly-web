import React, { useState } from 'react';
import { ActionIcon } from '@mantine/core';
import {
	IconUser,
	IconBellRinging,
	IconSettings,
	IconAddressBook,
} from '@tabler/icons-react';
import Link from 'next/link';

import { useCurUserContext } from '../../utils/CurUserContext';
import { NavInner, NavItem, Navigation, PageContentContainer } from './styles';

type Props = {
	children: React.ReactNode;
	id?: number;
};
export default function NavigationLayout(props: Props) {
	const { curUser } = useCurUserContext();

	const [isNavHidden, setIsNavHidden] = useState(false);

	const NavContent = (
		<>
			<NavInner>
				<NavItem>
					<Link href={curUser.user ? `/profile/${curUser.user.id}` : ''}>
						<ActionIcon color='grape' variant='transparent' component='span'>
							<IconUser size={20} />
						</ActionIcon>
					</Link>
				</NavItem>
				<NavItem>
					<Link href='/feed'>
						<ActionIcon color='grape' variant='transparent' component='span'>
							<IconAddressBook size={20} />
						</ActionIcon>
					</Link>
				</NavItem>
				<NavItem>
					<Link href='/activity'>
						<ActionIcon color='grape' variant='transparent' component='span'>
							<IconBellRinging size={20} />
						</ActionIcon>
					</Link>
				</NavItem>
				<NavItem id='nav-settings'>
					<Link href='/settings'>
						<ActionIcon color='grape' variant='transparent' component='span'>
							<IconSettings size={20} />
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
