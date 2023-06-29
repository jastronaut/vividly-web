import { useState, useEffect } from 'react';
import styled from 'styled-components';
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

import { DEFAULT_AVATAR, IMGBB_API_KEY } from '@/constants';

import { Avatar } from '@/components/Avatar';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { showAndLogErrorNotification } from '@/showerror';
import { MiniLoader } from '../utils/Loading';
import { DismissWarningModal } from '../DismissWarningModal';
import { User } from '@/types/user';

const ImageEditContainer = styled.div`
	position: absolute;
	top: 0;
	height: 150px;
	width: 150px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 75px;
	backdrop-filter: blur(6px);
	-webkit-backdrop-filter: blur(6px);
	-o-backdrop-filter: blur(6px);
	-moz-backdrop-filter: blur(6px);
`;

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

	const tryClose = () => {
		if (formIsDirty) {
			setIsWarningModalOpen(true);
		} else {
			props.onClose();
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
		setUsername(curUser.user.username);
	}, [curUser.user.username]);

	useEffect(() => {
		setName(curUser.user.name);
	}, [curUser.user.name]);

	useEffect(() => {
		setBio(curUser.user.bio);
	}, [curUser.user.bio]);

	return (
		<Modal opened={props.isOpen} onClose={tryClose} title='Edit profile'>
			<DismissWarningModal
				isOpen={isWarningModalOpen}
				onNo={() => setIsWarningModalOpen(false)}
				onYes={() => {
					setIsWarningModalOpen(false);
					props.onClose();
				}}
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
					props.onClickSave({
						...curUser.user,
						name,
						username,
						bio,
						avatarSrc: newAvatarSrc,
					});
					props.onClose();
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
				/>
				<Space h='md' />
				<Button
					size='sm'
					color='grape'
					radius='xl'
					type='submit'
					disabled={!formIsDirty}
					sx={{
						boxShadow: '0 4px 0 pink',
					}}
				>
					Save
				</Button>
			</form>
		</Modal>
	);
};
