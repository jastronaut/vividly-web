import { Group, ActionIcon, Tooltip, Menu } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
	IconUsers,
	IconDots,
	IconEdit,
	IconTool,
	IconMessage,
	IconSettings,
} from '@tabler/icons-react';
import styled from 'styled-components';
import { rem } from 'polished';
import Link from 'next/link';
import { useVividlyTheme } from '@/styles/Theme';

const MobileMenuContainer = styled.div`
	display: flex;
	position: absolute;
	right: ${rem(16)};
	top: ${rem(16)};
`;

type Props = {
	onClickEdit: () => void;
	onClickFriends: () => void;
};

export const ProfileActions = (props: Props) => {
	const matches = useMediaQuery(`(max-width:  ${rem(500)})`);
	const { accentColor } = useVividlyTheme();

	if (matches) {
		return (
			<>
				<MobileMenuContainer id='mobile-menu-container'>
					<Menu withArrow offset={0} position='left-start'>
						<Menu.Target>
							<ActionIcon>
								<IconDots size={16} />
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								onClick={props.onClickFriends}
								icon={<IconUsers size={18} />}
							>
								View friends
							</Menu.Item>
							<Menu.Item
								onClick={props.onClickEdit}
								icon={<IconEdit size={18} />}
							>
								Edit profile
							</Menu.Item>
							<Link href='/settings'>
								<Menu.Item onClick={() => {}} icon={<IconSettings size={18} />}>
									Account settings
								</Menu.Item>
							</Link>
							<Link href='/feedback'>
								<Menu.Item onClick={() => {}} icon={<IconMessage size={18} />}>
									Send feedback
								</Menu.Item>
							</Link>
						</Menu.Dropdown>
					</Menu>
				</MobileMenuContainer>
			</>
		);
	}

	return (
		<Group>
			<ActionIcon
				onClick={props.onClickFriends}
				color={accentColor}
				variant='light'
				aria-label='View friends'
			>
				<Tooltip withArrow label='View friends' position='bottom'>
					<IconUsers size={18} />
				</Tooltip>
			</ActionIcon>
			<ActionIcon
				variant='light'
				color={accentColor}
				onClick={props.onClickEdit}
				aria-label='Edit profile'
			>
				<IconTool size={18} />
			</ActionIcon>
		</Group>
	);
};
