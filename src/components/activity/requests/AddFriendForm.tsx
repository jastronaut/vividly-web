import { useState, useEffect } from 'react';
import { TextInput, Button, Group, Text, Space, Alert } from '@mantine/core';
import { IconAt, IconAlertCircle } from '@tabler/icons-react';

import { FriendRequest } from '@/types/user';
import { useAddNewFriend } from './hooks';

type Props = {
	onSubmit: (request: FriendRequest) => void;
};

export const AddFriendForm = (props: Props) => {
	const [username, setUsername] = useState<string>('');
	const { addFriend, error, isAddingFriend, friendRequest } = useAddNewFriend();

	useEffect(() => {
		if (friendRequest) {
			props.onSubmit(friendRequest);
			setUsername('');
		}
	}, [friendRequest]);

	return (
		<>
			<Text fw={700}>Add friend by username</Text>
			<Space h='xs' />
			<Group align='center'>
				<TextInput
					aria-label='Add friend by username'
					placeholder={`Enter a username`}
					type='text'
					variant='filled'
					icon={<IconAt size={16} />}
					maxLength={20}
					value={username}
					minLength={3}
					onChange={e => setUsername(e.currentTarget.value.trim())}
				/>
				<Button
					type='submit'
					color='green'
					onClick={() => addFriend(username)}
					loading={isAddingFriend}
				>
					Add Friend
				</Button>
			</Group>
			{error && (
				<>
					<Space h='xs' />
					<Alert
						icon={<IconAlertCircle size={18} />}
						color='red'
						sx={{ display: 'block', width: 'fit-content' }}
					>{`${error} 😢`}</Alert>
				</>
			)}
		</>
	);
};
