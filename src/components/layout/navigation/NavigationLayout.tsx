import React, { useState, useEffect } from 'react';
import { ActionIcon, Indicator } from '@mantine/core';
import {
	IconUser,
	IconBellRinging,
	IconSettings,
	IconAddressBook,
	IconBolt,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useCurUserContext } from '../../contexts/CurUserContext';
import { NavInner, NavItem, Navigation, PageContentContainer } from './styles';
import { useNotificationsContext } from '@/components/contexts/NotificationsContext';
import { useFriendRequestsContext } from '@/components/contexts/FriendRequestsContext';
import { useVividlyTheme } from '@/styles/Theme';

type Props = {
	children: React.ReactNode;
	id?: number;
};
export default function NavigationLayout(props: Props) {
	const { curUser } = useCurUserContext();
	const { unreadCount, refetch: refetchNotifs } = useNotificationsContext();
	const { numRequests, refetch: refetchRews } = useFriendRequestsContext();
	const [isNavHidden, setIsNavHidden] = useState(false);
	const router = useRouter();
	const { accentColor } = useVividlyTheme();

	const actionIconProps = {
		color: accentColor,
		variant: 'transparent' as const,
		component: 'span' as const,
	};

	const isNotifsIndicatorVisible = numRequests > 0 || unreadCount > 0;

	useEffect(() => {
		refetchNotifs();
		refetchRews();
	}, [router.asPath]);

	const NavContent = (
		<>
			<NavInner>
				<NavItem>
					<Link href={curUser.user ? `/profile/${curUser.user.id}` : ''}>
						<ActionIcon {...actionIconProps}>
							<IconUser size={22} />
						</ActionIcon>
					</Link>
				</NavItem>
				<NavItem>
					<Link href='/feed'>
						<ActionIcon {...actionIconProps}>
							<IconAddressBook size={22} />
						</ActionIcon>
					</Link>
				</NavItem>
				<NavItem>
					<Indicator color='green' disabled={!isNotifsIndicatorVisible}>
						<Link href='/activity'>
							<ActionIcon {...actionIconProps}>
								<IconBellRinging size={22} />
							</ActionIcon>
						</Link>
					</Indicator>
				</NavItem>
				<NavItem>
					<Link href='/feedback'>
						<ActionIcon {...actionIconProps}>
							<IconBolt size={22} />
						</ActionIcon>
					</Link>
				</NavItem>
				<NavItem id='nav-hidden'>
					<Link href='/settings'>
						<ActionIcon {...actionIconProps}>
							<IconSettings size={22} />
						</ActionIcon>
					</Link>
				</NavItem>
			</NavInner>
		</>
	);

	return (
		<>
			<Navigation $isHidden={isNavHidden}>{NavContent}</Navigation>
			<PageContentContainer>{props.children}</PageContentContainer>
		</>
	);
}
