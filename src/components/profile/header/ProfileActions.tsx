import { Group, ActionIcon, Tooltip, Menu } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconUsers, IconDots, IconEdit, IconTool } from '@tabler/icons-react';
import styled from 'styled-components';
import { rem } from 'polished';

const MobileMenuContainer = styled.div`
	display: flex;
	position: absolute;
	right: ${rem(16)};
	top: ${rem(16)};
`;

type Props = {
	onClickEdit: () => void;
	onClickFriends: () => void;
	toggleInformation: () => void;
};

export const ProfileActions = (props: Props) => {
	const matches = useMediaQuery(`(max-width:  ${rem(500)})`);
	if (matches) {
		return (
			<>
				<MobileMenuContainer id='mobile-menu-container'>
					<Menu withArrow offset={0} position='left-start'>
						<Menu.Target>
							<ActionIcon>
								<IconDots size={14} />
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								onClick={props.onClickFriends}
								icon={<IconUsers size={14} />}
							>
								View friends
							</Menu.Item>
							<Menu.Item
								onClick={props.onClickEdit}
								icon={<IconEdit size={14} />}
							>
								Edit profile
							</Menu.Item>
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
				color='grape'
				variant='outline'
				aria-label='View friends'
			>
				<Tooltip withArrow label='View friends' position='bottom'>
					<IconUsers size={16} />
				</Tooltip>
			</ActionIcon>
			<ActionIcon
				variant='outline'
				color='grape'
				onClick={props.onClickEdit}
				aria-label='Edit profile'
			>
				<IconTool size={16} />
			</ActionIcon>
		</Group>
	);
};
