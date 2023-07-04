import { useEffect } from 'react';
import useSWR from 'swr';
import { Drawer, Button, Center, Space } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { rem } from 'polished';

import { FriendsResponse } from '@/types/api';
import { fetchWithToken } from '@/utils';
import { FriendItem } from './FriendItem';
import { showAndLogErrorNotification } from '@/showerror';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { MiniLoader } from '@/components/utils/Loading';
import {
	useUnfriend,
	useToggleFavorite,
} from '@/components/activity/requests/hooks';
import { URL_PREFIX } from '@/constants';
import { sortFriends } from '../utils';
import { DrawerStyles } from './styles';

type Props = {
	isOpen: boolean;
	close: () => void;
};

export const FriendsDrawer = (props: Props) => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;
	const { data, error, isLoading, mutate } = useSWR<FriendsResponse>(
		[token ? `${URL_PREFIX}/friends` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false }
	);

	const {
		unfriend,
		isLoading: unfriendLoading,
		error: unfriendError,
	} = useUnfriend();

	const {
		toggleFavorite,
		isLoading: toggleFavoriteLoading,
		error: toggleFavoriteError,
	} = useToggleFavorite();

	const showLoading = isLoading || !data;

	const sortedFriends = data?.friends.sort(sortFriends);

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

	const toggleFavoriteAndUpdate = (id: number, isFavorite: boolean) => {
		toggleFavorite(id, isFavorite);
		mutate(data => {
			if (data) {
				return {
					...data,
					friends: data.friends.map(friend => {
						if (friend.friend.id === id) {
							return {
								...friend,
								isFavorite: !friend.isFavorite,
							};
						}
						return friend;
					}),
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
			<DrawerStyles />
			<Drawer
				opened={props.isOpen}
				onClose={props.close}
				title='Friends'
				position='right'
			>
				<Center>
					<Link href='/friend-requests'>
						<Button
							component='span'
							rightIcon={<IconArrowRight />}
							variant='outline'
						>
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
				{sortedFriends &&
					sortedFriends.map(friend => {
						return (
							<FriendItem
								key={`friend-list-${friend.id}`}
								friendshipInfo={friend}
								closeDrawer={props.close}
								unfriendUser={unfriendAndUpdate}
								toggleFavorite={toggleFavoriteAndUpdate}
							/>
						);
					})}
			</Drawer>
		</>
	);
};
