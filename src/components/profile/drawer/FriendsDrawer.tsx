import { useEffect } from 'react';
import { KeyedMutator } from 'swr';
import { Drawer, Button, Center, Space } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { rem } from 'polished';

import { FriendsResponse } from '@/types/api';
import { FriendItem } from './FriendItem';
import { showAndLogErrorNotification } from '@/showerror';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { MiniLoader } from '@/components/utils/Loading';
import {
	useUnfriend,
	useToggleFavorite,
} from '@/components/activity/requests/hooks';
import { sortFriends } from '../utils';
import { DrawerStyles } from './styles';

type Props = {
	isOpen: boolean;
	close: () => void;
	mutateFriends: KeyedMutator<FriendsResponse>;
	friendsData?: FriendsResponse;
	isFriendsLoading: boolean;
};

export const FriendsDrawer = (props: Props) => {
	const { mutateFriends, friendsData, isFriendsLoading } = props;

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

	const sortedFriends = friendsData?.friends.sort(sortFriends);

	const unfriendAndUpdate = (id: number) => {
		unfriend(id);
		mutateFriends(data => {
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
		mutateFriends(data => {
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
				{isFriendsLoading && (
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
