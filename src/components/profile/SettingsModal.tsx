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
	ActionIcon,
} from '@mantine/core';
import { IconPhotoPlus } from '@tabler/icons-react';

import { IMGBB_API_KEY } from '@/constants';
import { IMGBBResponse } from '@/types/api';

import { useCurUserContext } from '@/components/utils/CurUserContext';
import { showAndLogErrorNotification } from '@/showerror';

const ImageEditContainer = styled.div`
	position: absolute;
	top: 0;
	height: 100%;
	width: 150px;
	display: flex;
	align-items: center;
	justify-content: center;

	button {
		opacity: 0.8;
	}
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

	const uploadImage = async (file: File | null) => {
		setUploadingAvatar(true);
		if (file === null || file.length < 1) {
			return;
		}

		fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			body: createImageUploadRequest(file),
		})
			.then(res => res.json())
			.then(res => {
				const resData = res as IMGBBResponse;
				if (!resData.success) throw new Error('Error uploading image to imgbb');
				setNewAvatarSrc(resData.data.url);
			})
			.catch(err => {
				showAndLogErrorNotification(err, 'Error uploading image');
			});
		setUploadingAvatar(false);
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
				<ImageEditContainer>
					<ActionIcon variant='filled' radius='xl' size='lg' title='Add photo'>
						<IconPhotoPlus />
					</ActionIcon>
				</ImageEditContainer>
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
