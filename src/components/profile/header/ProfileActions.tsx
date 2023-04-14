import { Button, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';

type Props = {
	onClickEdit: () => void;
	onClickFriends: () => void;
};

export const ProfileActions = (props: Props) => {
	return (
		<Group>
			<ActionIcon
				onClick={props.onClickFriends}
				color='grape'
				variant='outline'
				aria-label='See friends'
			>
				<Tooltip withArrow label='See friends'>
					<IconUsers size={16} />
				</Tooltip>
			</ActionIcon>
			<Button
				variant='outline'
				size='sm'
				color='grape'
				radius='xl'
				onClick={props.onClickEdit}
			>
				Edit profile
			</Button>
		</Group>
	);
};
