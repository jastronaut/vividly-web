import { useEffect } from 'react';
import useSWR from 'swr';
import { Drawer, Button, Center, Space } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { rem } from 'polished';

import { FriendsRespose } from '@/types/api';
import { fetchWithToken } from '@/utils';
import { FriendItem } from './FriendItem';
import { showAndLogErrorNotification } from '@/showerror';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { MiniLoader } from '@/components/utils/Loading';

type Props = {
	isOpen: boolean;
	close: () => void;
};

export const FriendsDrawer = (props: Props) => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;
	const { data, error, isLoading } = useSWR<FriendsRespose>(
		[token ? `http://localhost:1337/v0/friends` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const showLoading = isLoading || !data;

	useEffect(() => {
		if (error) {
			showAndLogErrorNotification(`Couldn't get friends list.`, error);
		}
	}, [error]);

	return (
		<>
			<Drawer
				opened={props.isOpen}
				onClose={props.close}
				title='Friends'
				position='right'
			>
				<Center>
					<Link href='/friend-requests'>
						<Button component='a' rightIcon={<IconArrowRight />}>
							Manage friend requests
						</Button>
					</Link>
				</Center>
				<Space h={rem(14)} />
				{showLoading && (
					<Center
						sx={{
							marginTop: rem(48),
						}}
					>
						<MiniLoader />
					</Center>
				)}
				{!showLoading &&
					data.friends.map(friend => {
						return (
							<FriendItem
								key={`friend${friend.friend.id}-${friend.id}`}
								friendshipInfo={friend}
								closeDrawer={props.close}
							/>
						);
					})}
			</Drawer>
		</>
	);
};
