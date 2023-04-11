import { useState } from 'react';
import { TextInput, Button, Group, Title, Space } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';

type Props = {
	onSubmit: (username: string) => void;
};

export const AddFriendForm = (props: Props) => {
	const [username, setUsername] = useState<string>('');

	const tryOnSubmit = () => {
		if (username.length < 3 || username.length > 20) {
			return;
		}
		props.onSubmit(username);
		setUsername('');
	};

	return (
		<>
			<Title order={5}>Add friend by username</Title>
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
				<Button type='submit' color='green' onClick={tryOnSubmit}>
					Add Friend
				</Button>
			</Group>
		</>
	);
};
