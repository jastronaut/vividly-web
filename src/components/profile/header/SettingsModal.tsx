import { useState, useEffect, useCallback } from 'react';
import { rem } from 'polished';
import {
	Textarea,
	Modal,
	TextInput,
	Button,
	Space,
	FileButton,
	Center,
} from '@mantine/core';
import { IconPhotoPlus } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

import { DEFAULT_AVATAR, IMGBB_API_KEY } from '@/constants';
import { URL_PREFIX } from '@/constants';

import { Avatar } from '@/components/Avatar';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { showAndLogErrorNotification } from '@/showerror';
import { DismissWarningModal } from '../../DismissWarningModal';
import { User } from '@/types/user';

function getErrorText(errorCode: string | null) {
	switch (errorCode) {
		case 'USERNAME_TAKEN':
			return 'Username is taken';
		case 'USERNAME_INVALID':
			return 'Username is invalid';
		default:
			return null;
	}
}

function createImageUploadRequest(file: File) {
	const formData = new FormData();
	formData.append('image', file);
	formData.append('type', 'file');
	return formData;
}

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onClickSave: (newUser: User) => void;
};

export const SettingsModal = (props: Props) => {
	const { curUser } = useCurUserContext();
	const [name, setName] = useState(curUser.user.name);
	const [username, setUsername] = useState(curUser.user.username);
	const [bio, setBio] = useState(curUser.user.bio);
	const [newAvatarSrc, setNewAvatarSrc] = useState('');
	const [uploadingAvatar, setUploadingAvatar] = useState(false);
	const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
	const [error, setError] = useState(null);

	const isMobile = useMediaQuery('(max-width: 800px)');

	const onClickSaveSettings = useCallback(async () => {
		if (!curUser || !curUser.token) {
			return;
		}

		const resp: { [key: string]: string } = {};
		resp['name'] = name;
		resp['bio'] = bio;
		if (newAvatarSrc && newAvatarSrc !== curUser.user.avatarSrc) {
			resp['avatarSrc'] = newAvatarSrc;
		}

		try {
			// change username
			if (username !== curUser.user.username) {
				const usernameRes = await fetch(`${URL_PREFIX}/users/username/change`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${curUser.token}`,
					},
					body: JSON.stringify({ username }),
				});

				const usernameData = await usernameRes.json();

				if (usernameData.error) {
					throw new Error(usernameData.errorCode);
				}
			}

			// change bio, name, avatar
			const req = await fetch(`${URL_PREFIX}/users/info/change`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${curUser.token}`,
				},
				body: JSON.stringify(resp),
			});

			const data = await req.json();
			if (data.error) {
				throw new Error(data.errorCode);
			}

			props.onClickSave(data.user);
			closeModal();
		} catch (err: any) {
			setError(err.message);
		}
	}, [curUser, username, bio, newAvatarSrc, name]);

	const formIsDirty =
		name !== curUser.user.name ||
		bio !== curUser.user.bio ||
		username !== curUser.user.username ||
		newAvatarSrc !== '';

	const uploadImage = (file: File | null) => {
		if (file === null || file.length < 1) {
			return;
		}

		const upload = async () => {
			try {
				setUploadingAvatar(true);
				const res = await fetch(
					`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
					{
						method: 'POST',
						headers: {
							Accept: 'application/json',
						},
						body: createImageUploadRequest(file),
					}
				);

				const resData = await res.json();
				if (!resData.success) throw new Error('Error uploading image to imgbb');
				setNewAvatarSrc(resData.data.url);
			} catch (err) {
				showAndLogErrorNotification('Error uploading image', err);
			}
			setUploadingAvatar(false);
		};

		upload();
	};

	const closeModal = () => {
		setUsername(curUser.user.username);
		setName(curUser.user.name);
		setBio(curUser.user.bio);
		setError(null);
		setIsWarningModalOpen(false);
		props.onClose();
	};

	const tryClose = () => {
		if (formIsDirty) {
			setIsWarningModalOpen(true);
		} else {
			closeModal();
		}
	};

	// useEffect(() => {
	// if (props.isOpen) {
	// 	setNewAvatarSrc('');
	// 	setName(curUser.user.name);
	// 	setUsername(curUser.user.username);
	// }

	// 	return () => {
	// 		setNewAvatarSrc('');
	// 		setName(curUser.user.name);
	// 		setUsername(curUser.user.username);
	// 	};
	// }, []);

	useEffect(() => {
		setError(null);
	}, [props.isOpen]);

	useEffect(() => {
		setUsername(curUser.user.username);

		return () => {
			setUsername(curUser.user.username);
		};
	}, [curUser.user.username]);

	useEffect(() => {
		setName(curUser.user.name);

		return () => {
			setName(curUser.user.name);
		};
	}, [curUser.user.name]);

	useEffect(() => {
		setBio(curUser.user.bio);
	}, [curUser.user.bio]);

	return (
		<Modal
			opened={props.isOpen}
			onClose={tryClose}
			title='Edit profile'
			fullScreen={isMobile}
		>
			<DismissWarningModal
				isOpen={isWarningModalOpen}
				onNo={() => setIsWarningModalOpen(false)}
				onYes={closeModal}
				message='Abandon your changes? 😳'
			/>
			<div
				style={{
					position: 'relative',
				}}
			>
				<Center>
					<div>
						<Avatar
							src={newAvatarSrc || curUser.user.avatarSrc || DEFAULT_AVATAR}
							size={150}
							alt={`${curUser.user.username}'s avatar`}
						/>
						<Center>
							<FileButton
								onChange={uploadImage}
								accept='image/png,image/jpeg'
								// @ts-ignore
								leftIcon={<IconPhotoPlus size={16} />}
								variant='outline'
								size='xs'
								radius='md'
								loading={uploadingAvatar}
								sx={{ marginTop: rem(10), marginBottom: rem(10) }}
							>
								{props => <Button {...props}>Upload image</Button>}
							</FileButton>
						</Center>
					</div>
				</Center>
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					onClickSaveSettings();
				}}
			>
				<TextInput
					label='Name'
					radius='md'
					value={name}
					onChange={e => {
						setName(e.currentTarget.value);
					}}
					placeholder='Enter your name'
					maxLength={20}
					error={
						error === 'USER_INFO_NAME_INVALID' &&
						'Name must be at least 3 characters'
					}
				/>
				<Space h='sm' />
				<TextInput
					label='Username'
					radius='md'
					value={username}
					onChange={e => {
						setUsername(e.currentTarget.value);
					}}
					placeholder='Enter your username'
					maxLength={20}
					minLength={3}
					error={getErrorText(error)}
				/>
				<Space h='sm' />
				<Textarea
					label='Bio'
					radius='md'
					value={bio}
					onChange={e => {
						setBio(e.currentTarget.value);
					}}
					placeholder='Tell us about yourself!'
					maxLength={150}
					autosize
					maxRows={3}
				/>
				<Space h='md' />
				<Button
					size='sm'
					color='grape'
					radius='xl'
					type='submit'
					disabled={!formIsDirty}
				>
					Save
				</Button>
			</form>
		</Modal>
	);
};
