import { useState } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Modal, Text, Space } from '@mantine/core';
import styled, { createGlobalStyle } from 'styled-components';

import { postBlockToDescendant } from '../editor/utils';
import { Editor } from '../editor/Editor';
import { withEmbeds } from '../editor/utils';
import { Block, BlockType } from '@/types/post';
import { EditorBlockType } from '@/types/editor';
import { useMediaQuery } from '@mantine/hooks';
import { useFriendsContext } from '../contexts/FriendsContext';
import { useProfileContext } from '../contexts/ProfileFeedContext';

const ModalContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ModalStyles = createGlobalStyle`
	.mantine-Modal-header {
	}

	h2.mantine-Modal-title {
		width: 100% !important;
		text-align: center !important;
	}

	.mantine-UnstyledButton-root
		.mantine-ActionIcon-root
		.mantine-CloseButton-root
		.mantine-Modal-close {
		margin-left: 0;
	}
`;

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (blocks: Block[]) => void;
	initialDraft: Block[] | null;
	createdTime: string;
	postId: number;
	pageIndex: number;
};

export const EditPostModal = (props: Props) => {
	const [editor] = useState(() =>
		withHistory(withReact(withEmbeds(createEditor())))
	);
	const isMobile = useMediaQuery('(max-width: 800px)');
	const { friends } = useFriendsContext();
	const { updatePostFromBlocks } = useProfileContext();

	const friendsNamesList = friends
		? friends.map(friend => ({
				name: friend.friend.name,
				username: friend.friend.username,
		  }))
		: [];

	const onClose = () => {
		const point = { path: [0, 0], offset: 0 };
		editor.selection = { anchor: point, focus: point };
		editor.history = { redos: [], undos: [] };
		editor.children = [
			{
				type: EditorBlockType.TEXT,
				children: [{ text: '' }],
			},
		];
		props.onClose();
	};

	const onSubmit = (blocks: Block[]) => {
		props.onSubmit(blocks);
		updatePostFromBlocks(blocks, props.postId, props.pageIndex);
		onClose();
	};

	const blocksToEditorBlocks = (blocks: Block[]) => {
		const newBlocks = blocks.map(block => postBlockToDescendant(block));
		newBlocks.push({
			type: EditorBlockType.TEXT,
			children: [{ text: '' }],
		});
		return newBlocks;
	};

	const convertedBlocks = blocksToEditorBlocks(props.initialDraft || []);

	return (
		<>
			<ModalStyles />
			<Modal
				opened={props.isOpen}
				onClose={onClose}
				centered
				onFocus={() => console.log('focused')}
				fullScreen
				title='Edit Post'
				sx={{ margin: 0 }}
			>
				<ModalContentContainer>
					<Text c='dimmed' fz={isMobile ? 'xs' : 'sm'}>
						Created {props.createdTime}
					</Text>
					<Space h='xs' />
					<Editor
						editor={editor}
						onChange={_val => console.log('printed')}
						onSubmit={onSubmit}
						friendsList={friendsNamesList}
						onClickMagicPostActions={() => {}}
						initialValue={convertedBlocks}
						isFullscreen
					/>
				</ModalContentContainer>
			</Modal>
		</>
	);
};
