import { useState } from 'react';
import { useWindowScroll, useMediaQuery } from '@mantine/hooks';

import { DEFAULT_AVATAR } from '../../../constants';
import { User } from '@/types/user';
import { UserResponse } from '@/types/api';
import { SettingsModal } from './SettingsModal';
import {
	ProfileHeaderContent,
	HeaderText,
	UserInfoSection,
	RightContent,
} from './styles';
import { useCurUserContext } from '@/components/contexts/CurUserContext';
import { ProfileActions } from './ProfileActions';

import { throwConfetti } from '@/utils';
import { HeaderAvatar } from './HeaderAvatar';
import { HEADER_SCROLL_HEIGHT, HEADER_SCROLL_HEIGHT_MOBILE } from './constants';
import { ManageFriendshipButton } from './ManageFriendship';
import { useProfileContext } from '@/components/contexts/ProfileFeedContext';

type ProfileHeaderProps = {
	isLoading: boolean;
	isLoggedInUser: boolean;
	user?: UserResponse;
	friendsDrawerOpen: boolean;
	openFriendsDrawer: () => void;
	closeFriendsDrawer: () => void;
};

export const ProfileHeaderComponent = (props: ProfileHeaderProps) => {
	const { isLoading, user, isLoggedInUser } = props;
	const { avatarSrc } = user?.user ?? {};
	const [avatar, setAvatar] = useState<string>(avatarSrc || DEFAULT_AVATAR);
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
	const { curUser, updateCurUser } = useCurUserContext();
	const [scroll] = useWindowScroll();
	const isMobile = useMediaQuery('(max-width: 800px)');
	const { updateUser } = useProfileContext();

	let isHeaderScrolled = false;
	if (isMobile) {
		isHeaderScrolled = scroll.y > HEADER_SCROLL_HEIGHT_MOBILE;
	} else {
		isHeaderScrolled = scroll.y > HEADER_SCROLL_HEIGHT;
	}

	const onClickSaveSettings = (newUser: User) => {
		if (!user || user.user.id !== curUser.user.id) {
			return;
		}
		setAvatar(newUser.avatarSrc);
		updateUser({
			...user,
			user: newUser,
		});
		throwConfetti();
	};

	return (
		<>
			{isLoggedInUser && (
				<SettingsModal
					isOpen={isSettingsModalOpen}
					onClose={() => setIsSettingsModalOpen(false)}
					onClickSave={onClickSaveSettings}
				/>
			)}
			<ProfileHeaderContent scrolled={isHeaderScrolled}>
				<UserInfoSection>
					<HeaderAvatar
						isLoading={isLoading}
						avatarSrc={avatarSrc}
						username={user ? user.user.username : ''}
					/>
					<HeaderText
						name={user?.user.name}
						username={user?.user.username || ''}
						bio={user?.user.bio || ''}
						isLoading={isLoading}
					/>
				</UserInfoSection>
				<>
					<RightContent>
						{!user ? null : isLoggedInUser ? (
							<>
								<ProfileActions
									onClickFriends={props.openFriendsDrawer}
									onClickEdit={() => setIsSettingsModalOpen(true)}
								/>
							</>
						) : (
							<ManageFriendshipButton
								user={user}
								isLoggedInUser={isLoggedInUser}
							/>
						)}
					</RightContent>
				</>
			</ProfileHeaderContent>
		</>
	);
};
