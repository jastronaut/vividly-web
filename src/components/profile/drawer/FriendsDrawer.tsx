import { useEffect } from 'react';
import { Drawer, Button, Center, Space } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { rem } from 'polished';

import { FriendItem } from './FriendItem';
import { showAndLogErrorNotification } from '@/showerror';
import { MiniLoader } from '@/components/utils/Loading';
import {
	useUnfriend,
	useToggleFavorite,
} from '@/components/activity/requests/hooks';
import { sortFriends } from '../utils';
import { DrawerStyles } from './styles';
import { useFriendsContext } from '@/components/utils/FriendsContext';

type Props = {
	isOpen: boolean;
	close: () => void;
};

export const FriendsDrawer = (props: Props) => {
	const { friends, isLoading, removeFriend, favoriteFriend } =
		useFriendsContext();
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

	const sortedFriends = friends.sort(sortFriends);

	const unfriendAndUpdate = (id: number) => {
		unfriend(id);
		removeFriend(id);
	};

	const toggleFavoriteAndUpdate = (id: number, isFavorite: boolean) => {
		toggleFavorite(id, isFavorite);
		favoriteFriend(id);
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
				{isLoading && (
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
