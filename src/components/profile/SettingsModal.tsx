import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { borderRadius, rem } from 'polished';
import {
	Textarea,
	Modal,
	TextInput,
	Button,
	Space,
	Avatar,
	Overlay,
	ActionIcon,
} from '@mantine/core';
import { IconPhotoPlus } from '@tabler/icons-react';

import { useCurUserContext } from '@/components/utils/CurUserContext';

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

type Props = {
	isOpen: boolean;
	onClose: () => void;
};
export const SettingsModal = (props: Props) => {
	const { curUser } = useCurUserContext();
	const [name, setName] = useState(curUser.user.name);
	const [bio, setBio] = useState(curUser.user.bio);

	const tryOnClose = () => {
		if (name === curUser.user.name && bio === curUser.user.bio) {
			props.onClose();
			return;
		}
	};

	return (
		<Modal opened={props.isOpen} onClose={tryOnClose} title='Edit profile'>
			<div
				style={{
					position: 'relative',
				}}
			>
				<Avatar src={curUser.user.avatarSrc} size={150} radius={75} />
				<ImageEditContainer>
					<ActionIcon variant='filled' radius='xl' size='lg' title='Add photo'>
						<IconPhotoPlus />
					</ActionIcon>
				</ImageEditContainer>
			</div>
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
			<Button size='sm' color='grape' radius='xl'>
				Save
			</Button>
		</Modal>
	);
};
