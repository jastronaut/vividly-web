import { useState, useEffect, useCallback } from 'react';
import {
	Skeleton,
	Flex,
	Button,
	Group,
	ActionIcon,
	Menu,
	Tooltip,
	Avatar,
	Indicator,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
	IconMoodSmileBeam,
	IconUserPlus,
	IconUserMinus,
	IconUserOff,
	IconUsers,
} from '@tabler/icons-react';

import { makeApiCall } from '@/utils';
import { DEFAULT_AVATAR, URL_PREFIX } from '../../../constants';
import { User } from '@/types/user';
import { UserResponse, DefaultResponse } from '@/types/api';
import { SettingsModal } from '../SettingsModal';
import {
	FavoriteButton,
	ProfileHeaderContent,
	ProfileHeaderText,
	HeaderText,
	HeaderTextLoading,
	UserInfoSection,
} from './styles';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { showAndLogErrorNotification } from '@/showerror';
import { DismissWarningModal } from '@/components/DismissWarningModal';
import { ProfileActions } from './ProfileActions';

import {
	useAcceptFriendRequest,
	useAddNewFriend,
	useDeclineFriendRequest,
	useUnfriend,
	useCancelFriendRequest,
} from '@/components/activity/requests/hooks';
import { throwConfetti } from '@/utils';

function showSuccessNotification(message: string) {
	notifications.show({
		message,
		color: 'green',
		title: 'Success',
	});
}

type ProfileHeaderProps = {
	isLoading: boolean;
	isLoggedInUser: boolean;
	user?: UserResponse;
	updateUserProfileInfo: (user: UserResponse) => void;
	refetchFeed: () => void;
	friendsDrawerOpen: boolean;
	openFriendsDrawer: () => void;
	closeFriendsDrawer: () => void;
};

/**
 * this is unusually stupid and long because we need to
 * account for different states of the friend button
 * and the different actions it can trigger.
 * help!
 */
export const ProfileHeaderComponent = (props: ProfileHeaderProps) => {
	const {
		isLoading,
		user,
		isLoggedInUser,
		updateUserProfileInfo,
		refetchFeed,
	} = props;
	const { avatarSrc, name, username, bio } = user?.user ?? {};
	const [avatar, setAvatar] = useState<string>(avatarSrc || DEFAULT_AVATAR);
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
	const { curUser, updateCurUser } = useCurUserContext();
	const [warningModalOpen, setWarningModalOpen] = useState(false);

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

	const friendship = user?.friendship;
	const friendRequest = user?.friendRequest;

	const hasInboundRequest = friendRequest?.toUserId === curUser.user.id;
	const hasOutboundRequest = friendRequest?.fromUserId === curUser.user.id;

	// this indicates which set of actions the friend button should allow
	let friendButtonAction = 'none';
	if (friendship) {
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
		unfriend(user!.user.id);
		setWarningModalOpen(false);
	};

	const onClickSaveSettings = (
		name: string,
		bio: string,
		avatarSrc: string
	) => {
		if (!user || user.user.id !== curUser.user.id) {
			return;
		}

		const resp: { [key: string]: string } = {};
		resp['name'] = name;
		resp['bio'] = bio;
		if (avatarSrc) {
			resp['avatarSrc'] = avatarSrc;
		}

		fetch(`${URL_PREFIX}/users/info/change`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${curUser.token}`,
			},
			body: JSON.stringify(resp),
		})
			.then(res => res.json())
			.then(data => {
				const result = data as User;
				setAvatar(result.avatarSrc);
				updateUserProfileInfo({
					...user,
					user: {
						id: data.id,
						name: result.name,
						bio: result.bio,
						avatarSrc: result.avatarSrc,
						username: result.username,
					},
				});
			})
			.catch(err => {
				showAndLogErrorNotification(
					`Could not update user info at this time`,
					err
				);
			});
	};

	// hoooks to check when friend button is triggered, when they're loading, and
	// when they error
	useEffect(() => {
		if (
			chosenFriendButtonAction !== 'accept' ||
			!user ||
			acceptRequestLoading
		) {
			return;
		}

		if (acceptRequestError) {
			showAndLogErrorNotification(`Could not accept friend request!`);
		} else if (acceptedFriendship) {
			updateUserProfileInfo({
				...user,
				friendship: acceptedFriendship,
			});
			showSuccessNotification(`You are now friends with ${user.user.name}!`);
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
		if (chosenFriendButtonAction !== 'add' || !user || addFriendLoading) {
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
			{isLoggedInUser && (
				<SettingsModal
					isOpen={isSettingsModalOpen}
					onClose={() => setIsSettingsModalOpen(false)}
					onClickSave={onClickSaveSettings}
				/>
			)}
			<ProfileHeaderContent>
				<UserInfoSection>
					{isLoading ? (
						<Skeleton height={50} circle mb='xl' />
					) : (
						<Avatar
							src={avatarSrc || DEFAULT_AVATAR}
							size={50}
							radius='xl'
							alt={`${user?.user.username}'s avatar.`}
						/>
					)}
					<ProfileHeaderText>
						{isLoading || !user ? (
							<HeaderTextLoading />
						) : (
							<HeaderText
								name={user.user.name}
								username={user.user.username}
								bio={user.user.bio}
							/>
						)}
					</ProfileHeaderText>
				</UserInfoSection>
				<>
					<Flex>
						{isLoading || !user ? null : isLoggedInUser ? (
							<ProfileActions
								onClickFriends={props.openFriendsDrawer}
								onClickEdit={() => setIsSettingsModalOpen(true)}
							/>
						) : (
							<Group>
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
												variant={!!friendship ? 'filled' : 'outline'}
												aria-label='Manage friendship'
											>
												<Tooltip withArrow label='Manage friendship'>
													<IconMoodSmileBeam size={16} />
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
										) : friendButtonAction === 'outbound' &&
										  user.friendRequest ? (
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
										) : friendButtonAction === 'none' ? (
											<Menu.Item
												icon={<IconUserPlus size={14} />}
												onClick={() => {
													setChosenFriendButtonAction('add');
													addFriend(user.user.username);
												}}
											>
												Add friend
											</Menu.Item>
										) : null}
									</Menu.Dropdown>
								</Menu>

								{friendButtonAction === 'friends' && user.friendship && (
									<FavoriteButton
										isFavorite={user.friendship.isFavorite}
										toggleFavorite={toggleFavorite}
									/>
								)}
							</Group>
						)}
					</Flex>
				</>
			</ProfileHeaderContent>
		</>
	);
};
