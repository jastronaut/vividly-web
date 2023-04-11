import { useState } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Skeleton, Avatar, Text, Flex, Button, Group } from '@mantine/core';

import { DEFAULT_AVATAR } from '../../../constants';
import { SettingsModal } from '../SettingsModal';
import { FriendButton, FavoriteButton } from './styles';
import { UserResponse } from '@/types/api';
import { uri } from '@/constants';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { showAndLogErrorNotification } from '@/showerror';
import { User } from '@/types/user';

export const ProfileHeaderContainer = styled.div`
	padding-top: ${rem(50)};
	border: 1px solid ${props => props.theme.border.secondary};
	color: ${props => props.theme.text.primary};
	background-size: cover;

	@media screen and (max-width: 700px) {
		margin: 0;
	}
`;

export const ProfileHeaderContent = styled.div`
	background-color: ${props => props.theme.background.primary};
	display: flex;
	padding: ${rem(10)} ${rem(15)} ${rem(16)};
	margin-top: ${rem(50)};
	border-top: ${rem(10)} solid ${props => props.theme.background.primary};
	border-top-left-radius: ${rem(20)};
	border-top-right-radius: ${rem(20)};

	@media screen and (max-width: 500px) {
		padding-bottom: ${rem(6)};
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: ${rem(24)};
		text-align: center;
	}
`;

export const ProfileHeaderText = styled.div`
	flex: 9;
	margin: 1rem;

	a,
	a:visited {
		color: ${props => props.theme.link};
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	> h2 {
		margin: 0;
	}

	> p:last-child {
		margin: 0 auto;
		word-break: break-word;
	}
`;

type ProfileHeaderProps = {
	isLoading: boolean;
	isLoggedInUser: boolean;
	user?: UserResponse;
	updateUserProfileInfo?: (user: User) => void;
};

export const ProfileHeaderComponent = (props: ProfileHeaderProps) => {
	const {
		isLoading,
		user,
		isLoggedInUser,
		updateUserProfileInfo = null,
	} = props;
	const { avatarSrc, name, username, bio } = user?.user ?? {};
	const [avatar, setAvatar] = useState<string>(
		user?.user.avatarSrc || DEFAULT_AVATAR
	);
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
	const { curUser, updateCurUser } = useCurUserContext();

	const friendship = user?.friendship;

	const onClickSaveSettings = (
		name: string,
		bio: string,
		avatarSrc: string
	) => {
		if (!updateUserProfileInfo) return;

		const resp: { [key: string]: string } = {};
		if (name) resp['name'] = name;
		if (bio) resp['bio'] = bio;
		if (avatarSrc) resp['avatarSrc'] = avatarSrc;

		fetch(`${uri}users/info/change`, {
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
					id: data.id,
					name: result.name,
					bio: result.bio,
					avatarSrc: result.avatarSrc,
					username: result.username,
				});
			})
			.catch(err => {
				showAndLogErrorNotification(
					`Could not update user info at this time`,
					err
				);
			});
	};

	return (
		<ProfileHeaderContainer>
			{isLoggedInUser && (
				<SettingsModal
					isOpen={isSettingsModalOpen}
					onClose={() => setIsSettingsModalOpen(false)}
					onClickSave={onClickSaveSettings}
				/>
			)}
			<ProfileHeaderContent>
				{isLoading ? (
					<Skeleton height={100} circle mb='xl' />
				) : (
					<Avatar src={avatarSrc || DEFAULT_AVATAR} radius={50} size={100} />
				)}
				<ProfileHeaderText>
					{isLoading && <Skeleton height={28} width='60%' />}
					{!isLoading && <h2>{name ?? username}</h2>}

					{isLoading && <Skeleton height={16} mt={6} width='20%' />}

					{isLoading && <Skeleton height={16} mt={6} width='40%' />}
					{!isLoading && <Text>{bio || 'No bio yet.'}</Text>}
				</ProfileHeaderText>
				<>
					<Flex>
						{isLoading ? null : isLoggedInUser ? (
							<>
								<Button
									variant='outline'
									size='sm'
									color='grape'
									radius='xl'
									onClick={() => setIsSettingsModalOpen(true)}
								>
									Edit profile
								</Button>
							</>
						) : (
							<Group>
								<FriendButton
									isFavorite={!!friendship?.isFavorite}
									isFriend={!!friendship}
								/>
								<FavoriteButton />
							</Group>
						)}
					</Flex>
				</>
			</ProfileHeaderContent>
		</ProfileHeaderContainer>
	);
};
