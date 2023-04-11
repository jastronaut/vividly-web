import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import {
	Textarea,
	Modal,
	TextInput,
	Button,
	Space,
	Avatar,
	FileButton,
} from '@mantine/core';
import { IconPhotoPlus } from '@tabler/icons-react';

import { IMGBB_API_KEY } from '@/constants';
import { IMGBBResponse } from '@/types/api';

import { useCurUserContext } from '@/components/utils/CurUserContext';
import { showAndLogErrorNotification } from '@/showerror';

import { MiniLoader } from '../utils/Loading';

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
	onClickSave: (name: string, bio: string, avatarSrc: string) => void;
};

export const SettingsModal = (props: Props) => {
	const { curUser } = useCurUserContext();
	const [name, setName] = useState(curUser.user.name);
	const [bio, setBio] = useState(curUser.user.bio);
	const [newAvatarSrc, setNewAvatarSrc] = useState('');
	const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

	useEffect(() => {
		return () => {
			setNewAvatarSrc('');
		};
	}, []);

	return (
		<Modal opened={props.isOpen} onClose={props.onClose} title='Edit profile'>
			<div
				style={{
					position: 'relative',
				}}
			>
				<Avatar
					src={newAvatarSrc || curUser.user.avatarSrc}
					size={150}
					radius={75}
				/>

				{uploadingAvatar && (
					<ImageEditContainer>
						<MiniLoader />
					</ImageEditContainer>
				)}

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
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					props.onClickSave(name, bio, newAvatarSrc);
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
				/>
				<Space h='md' />
				<Button size='sm' color='grape' radius='xl' type='submit'>
					Save
				</Button>
			</form>
		</Modal>
	);
};
