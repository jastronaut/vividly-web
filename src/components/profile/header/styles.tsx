import { ActionIcon, Menu } from '@mantine/core';
import {
	IconMoodSmileBeam,
	IconStar,
	IconBan,
	IconUserPlus,
} from '@tabler/icons-react';

type FriendButtonProps = {
	isFavorite: boolean;
	isFriend: boolean;
};

export const FriendButton = (props: FriendButtonProps) => {
	return (
		<Menu position='bottom-end' withArrow offset={0}>
			<Menu.Target>
				<ActionIcon onClick={() => null} color='yellow' variant='outline'>
					<IconMoodSmileBeam size={16} />
				</ActionIcon>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item icon={<IconUserPlus size={14} />} onClick={() => null}>
					Add friend
				</Menu.Item>
				<Menu.Item
					color='red'
					icon={<IconBan size={14} />}
					onClick={() => null}
				>
					Block user
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

export const FavoriteButton = () => {
	return (
		<ActionIcon onClick={() => null} color='yellow' variant='outline'>
			<IconStar size={16} />
		</ActionIcon>
	);
};
