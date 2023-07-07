import { useState, useEffect, useCallback } from 'react';
import { Group, ActionIcon, Menu, Tooltip, Indicator } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useWindowScroll, useMediaQuery } from '@mantine/hooks';
import {
	IconUserPlus,
	IconUserMinus,
	IconUserOff,
	IconMoodCheck,
	IconMoodSmile,
} from '@tabler/icons-react';

import { makeApiCall } from '@/utils';
import { DEFAULT_AVATAR } from '../../../constants';
import { Friend, User } from '@/types/user';
import { UserResponse, DefaultResponse } from '@/types/api';
import { FavoriteButton, FriendActionsMenuContainer } from './styles';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { showAndLogErrorNotification } from '@/showerror';

import {
	useAcceptFriendRequest,
	useAddNewFriend,
	useDeclineFriendRequest,
	useUnfriend,
	useCancelFriendRequest,
} from '@/components/activity/requests/hooks';
import { throwConfetti } from '@/utils';
import { DismissWarningModal } from '@/components/DismissWarningModal';

function showSuccessNotification(message: string) {
	notifications.show({
		message,
		color: 'green',
		title: 'Success',
	});
}

type ProfileHeaderProps = {
	updateUserProfileInfo: (user: UserResponse) => void;
	refetchFeed: () => void;
	user: UserResponse;
	isLoggedInUser: boolean;
};

/**
 * this is unusually stupid and long because we need to
 * account for different states of the friend button
 * and the different actions it can trigger.
 * help!
 */
export const ManageFriendshipButton = (props: ProfileHeaderProps) => {
	const { updateUserProfileInfo, refetchFeed, user, isLoggedInUser } = props;
	const { curUser } = useCurUserContext();
	const [warningModalOpen, setWarningModalOpen] = useState(false);

	const { friendship, friendRequest } = user;
	const username = user.user.username;

	// this will indicate which action the user just triggered by clicking
	// the friend button
	const [chosenFriendButtonAction, setChosenFriendButtonAction] = useState<
		string | null
	>(null);

	const toggleFavorite = useCallback(async () => {
		if (!user || !user.friendship) {
			return;
		}

		try {
			const isFavorite = user.friendship.isFavorite;
			const uri = `/friends/${isFavorite ? 'un' : ''}favorite/${user.user.id}`;

			const res = await makeApiCall<DefaultResponse>({
				uri,
				method: 'POST',
				token: curUser.token,
			});

			if (!res.success) {
				throw new Error(res.error);
			}

			if (!isFavorite) {
				throwConfetti();
			}

			updateUserProfileInfo({
				...user,
				friendship: {
					...user.friendship,
					isFavorite: !isFavorite,
				},
			});
		} catch (err) {
			showAndLogErrorNotification(`Couldn't update favorite status!`, err);
		}
	}, [user]);

	const onClickUnfriend = () => {
		setWarningModalOpen(true);
	};

	const curUserId = curUser.user?.id;

	const hasInboundRequest = curUserId
		? friendRequest?.toUserId === curUserId
		: false;
	const hasOutboundRequest = curUserId
		? friendRequest?.fromUserId === curUserId
		: false;

	// this indicates which set of actions the friend button should allow
	let friendButtonAction = null;
	if (friendship && !friendRequest) {
		friendButtonAction = 'friends';
	} else if (hasInboundRequest) {
		friendButtonAction = 'inbound';
	} else if (hasOutboundRequest) {
		friendButtonAction = 'outbound';
	}

	// hooks for different friend button actions
	const {
		acceptFriendRequest,
		error: acceptRequestError,
		friendship: acceptedFriendship,
		isLoading: acceptRequestLoading,
	} = useAcceptFriendRequest();
	const {
		addFriend,
		error: addFriendError,
		friendRequest: newFriendRequest,
		isLoading: addFriendLoading,
	} = useAddNewFriend();
	const {
		declineFriendRequest,
		error: declineRequestError,
		isLoading: declineRequestLoading,
	} = useDeclineFriendRequest();

	const {
		unfriend,
		error: unfriendError,
		isLoading: unfriendLoading,
	} = useUnfriend();

	const {
		cancelFriendRequest,
		error: cancelRequestError,
		isLoading: cancelFriendRequestLoading,
	} = useCancelFriendRequest();

	const onConfirmUnfriend = () => {
		setChosenFriendButtonAction('unfriend');
		unfriend(user.user.id);
		setWarningModalOpen(false);
	};

	// hoooks to check when friend button is triggered, when they're loading, and
	// when they error
	useEffect(() => {
		if (chosenFriendButtonAction !== 'accept' || acceptRequestLoading) {
			return;
		}

		if (acceptRequestError) {
			showAndLogErrorNotification(`Could not accept friend request!`);
		} else if (acceptedFriendship) {
			updateUserProfileInfo({
				...user,
				friendship: acceptedFriendship,
			});
			showSuccessNotification(`You are now friends with ${username}!`);
			throwConfetti();
			refetchFeed();
		}

		setChosenFriendButtonAction(null);
	}, [
		chosenFriendButtonAction,
		acceptedFriendship,
		user,
		acceptRequestLoading,
	]);

	useEffect(() => {
		if (chosenFriendButtonAction !== 'add' || addFriendLoading) {
			return;
		}

		if (addFriendError) {
			showAndLogErrorNotification(`Could not add friend!`);
		} else if (newFriendRequest) {
			updateUserProfileInfo({
				...user,
				friendRequest: {
					id: newFriendRequest.id,
					fromUserId: curUser.user.id,
					toUserId: user.user.id,
				},
			});
			showSuccessNotification(`Friend request sent to ${user.user.name}!`);
		}

		setChosenFriendButtonAction(null);
	}, [chosenFriendButtonAction, newFriendRequest, user, addFriendLoading]);

	useEffect(() => {
		if (
			chosenFriendButtonAction !== 'decline' ||
			!user ||
			declineRequestLoading
		) {
			return;
		}

		if (!declineRequestLoading) {
			if (declineRequestError) {
				showAndLogErrorNotification(`Could not decline friend request!`);
			} else {
				updateUserProfileInfo({
					...user,
					friendRequest: null,
				});
				showSuccessNotification(`Friend request declined.`);
			}
		}

		setChosenFriendButtonAction(null);
	}, [chosenFriendButtonAction, declineRequestLoading, user]);

	useEffect(() => {
		if (chosenFriendButtonAction !== 'unfriend' || !user || unfriendLoading) {
			return;
		}

		if (unfriendError) {
			showAndLogErrorNotification(`Could not unfriend!`);
		} else {
			updateUserProfileInfo({
				...user,
				friendship: null,
			});

			showSuccessNotification(`User unfriended.`);
			refetchFeed();
		}

		setChosenFriendButtonAction(null);
	}, [chosenFriendButtonAction, unfriendLoading, user]);

	useEffect(() => {
		if (
			chosenFriendButtonAction !== 'cancel' ||
			!user ||
			cancelFriendRequestLoading
		) {
			return;
		}

		if (cancelRequestError) {
			showAndLogErrorNotification(`Could not cancel friend request!`);
		} else {
			updateUserProfileInfo({
				...user,
				friendRequest: null,
			});
			showSuccessNotification(`Friend request cancelled.`);
		}

		setChosenFriendButtonAction(null);
	}, [chosenFriendButtonAction, cancelFriendRequestLoading, user]);

	return (
		<>
			<DismissWarningModal
				isOpen={warningModalOpen}
				message={'Are you sure you want to unfriend this user?'}
				onNo={() => setWarningModalOpen(false)}
				onYes={onConfirmUnfriend}
			/>
			<FriendActionsMenuContainer id='friend-menu-container'>
				<Group spacing='sm'>
					<Menu position='bottom-end' withArrow offset={0}>
						<Menu.Target>
							<Indicator
								color='green'
								processing
								disabled={user.friendRequest === null}
							>
								<ActionIcon
									onClick={() => null}
									color='grape'
									variant={!!friendship ? 'light' : 'subtle'}
									aria-label='Manage friendship'
								>
									<Tooltip
										withArrow
										label='Manage friendship'
										position='bottom-end'
									>
										{user.friendship ? (
											<IconMoodCheck size={16} />
										) : (
											<IconMoodSmile size={16} />
										)}
									</Tooltip>
								</ActionIcon>
							</Indicator>
						</Menu.Target>
						<Menu.Dropdown>
							{friendButtonAction === 'inbound' && user.friendRequest ? (
								<>
									<Menu.Item
										icon={<IconUserPlus size={14} />}
										onClick={() => {
											setChosenFriendButtonAction('accept');
											// @ts-ignore
											acceptFriendRequest(user?.friendRequest?.id);
										}}
									>
										Accept friend request
									</Menu.Item>
									<Menu.Item
										icon={<IconUserOff size={14} />}
										onClick={() => {
											setChosenFriendButtonAction('decline');
											// @ts-ignore
											declineFriendRequest(user.friendRequest.id);
										}}
										color='red'
									>
										Decline friend request
									</Menu.Item>
								</>
							) : friendButtonAction === 'outbound' && user.friendRequest ? (
								<Menu.Item
									icon={<IconUserOff size={14} />}
									onClick={() => {
										setChosenFriendButtonAction('cancel');
										// @ts-ignore
										cancelFriendRequest(user.friendRequest.id);
									}}
								>
									Cancel friend request
								</Menu.Item>
							) : friendButtonAction === 'friends' ? (
								<Menu.Item
									icon={<IconUserMinus size={14} />}
									onClick={onClickUnfriend}
									color='red'
								>
									Unfriend
								</Menu.Item>
							) : (
								<Menu.Item
									icon={<IconUserPlus size={14} />}
									onClick={() => {
										setChosenFriendButtonAction('add');
										addFriend(user.user.username);
									}}
								>
									Add friend
								</Menu.Item>
							)}
						</Menu.Dropdown>
					</Menu>

					{friendButtonAction === 'friends' && user.friendship && (
						<FavoriteButton
							isFavorite={user.friendship.isFavorite}
							toggleFavorite={toggleFavorite}
						/>
					)}
				</Group>
			</FriendActionsMenuContainer>
		</>
	);
};