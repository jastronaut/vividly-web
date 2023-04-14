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
import { useUnfriend } from '@/components/activity/requests/hooks';

type Props = {
	isOpen: boolean;
	close: () => void;
};

export const FriendsDrawer = (props: Props) => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;
	const { data, error, isLoading, mutate } = useSWR<FriendsRespose>(
		[token ? `http://localhost:1337/v0/friends` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const {
		unfriend,
		isLoading: unfriendLoading,
		error: unfriendError,
	} = useUnfriend();

	const showLoading = isLoading || !data;

	const unfriendAndUpdate = (id: number) => {
		unfriend(id);
		mutate(data => {
			if (data) {
				return {
					...data,
					friends: data.friends.filter(friend => friend.friend.id !== id),
				};
			}
			return data;
		}, false);
	};

	useEffect(() => {
		if (error) {
			showAndLogErrorNotification(`Couldn't get friends list.`, error);
		}
	}, [error]);

	useEffect(() => {
		if (unfriendError) {
			showAndLogErrorNotification(`Couldn't unfriend user.`, unfriendError);
		}
	}, [unfriendError]);

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
								unfriendUser={unfriendAndUpdate}
							/>
						);
					})}
			</Drawer>
		</>
	);
};
