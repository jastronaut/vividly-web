import { useState } from 'react';
import {
	Button,
	Flex,
	Modal,
	Space,
	Text,
	Avatar,
	Container,
	Group,
	Menu,
	ActionIcon,
} from '@mantine/core';
import { IconDots, IconTrash } from '@tabler/icons-react';

import { Comment } from '@/types/post';

import { DismissWarningModal } from '@/components/DismissWarningModal';

import { AllComments, AddCommentContainer, CommentTextArea } from './styles';

const EmptyCommentsState = () => {
	return (
		<>
			<Space h='sm' />
			<Text c='dimmed' style={{ textAlign: 'center' }}>
				No comments... yet!
			</Text>
			<Space h='sm' />
		</>
	);
};

type CommentProps = {
	onDelete: () => void;
} & Comment;

const Comment = (props: CommentProps) => {
	return (
		<>
			<Group style={{ alignItems: 'start' }}>
				<Avatar src={props.author.avatarSrc} size='sm' radius='xl' />
				<div style={{ flexGrow: 1 }}>
					<Flex>
						<Text fw={700}>{props.author.name}</Text>
						<Text c='dimmed' style={{ marginLeft: '5px' }}>
							{` @`}
							{props.author.username}
						</Text>
					</Flex>
					<Text>{props.content}</Text>
				</div>
				<div style={{ justifySelf: 'flex-end' }}>
					<Menu position='bottom-end'>
						<Menu.Target>
							<ActionIcon>
								<IconDots size={14} />
							</ActionIcon>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								color='red'
								icon={<IconTrash size={14} />}
								onClick={props.onDelete}
							>
								Delete comment
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</div>
			</Group>

			<Space h='sm' />
		</>
	);
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
	comments: Comment[];
	onSubmit: (comment: string) => void;
	onDelete: (id: string) => void;
};

export const Comments = (props: Props) => {
	const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
	const [draft, setDraft] = useState('');

	const tryDismissModal = () => {
		if (isWarningModalOpen) {
			props.onClose();
			return;
		}

		if (draft.length === 0) {
			props.onClose();
			return;
		}

		setIsWarningModalOpen(true);
	};

	return (
		<Modal
			opened={props.isOpen}
			onClose={tryDismissModal}
			centered
			withCloseButton={false}
			padding='xl'
		>
			<DismissWarningModal
				isOpen={isWarningModalOpen}
				onClose={() => setIsWarningModalOpen(false)}
				onDeleteDraft={() => {
					props.onClose();
					setIsWarningModalOpen(false);
					setDraft('');
				}}
				message='Abandon this comment? 😳'
			/>
			<AllComments>
				{props.comments.map(comment => (
					<Comment
						key={comment.id}
						{...comment}
						onDelete={() => props.onDelete(comment.id)}
					/>
				))}
				{props.comments.length === 0 && <EmptyCommentsState />}
			</AllComments>
			<AddCommentContainer>
				<form
					onSubmit={e => {
						e.preventDefault();
						props.onSubmit(draft);
						setDraft('');
					}}
				>
					<CommentTextArea
						placeholder='Say something nice'
						autoFocus
						data-autofocus
						value={draft}
						onChange={e => setDraft(e.currentTarget.value)}
					/>
					<Flex justify='flex-end'>
						<Button radius='xl' color='grape' type='submit'>
							Send
						</Button>
					</Flex>
				</form>
			</AddCommentContainer>
		</Modal>
	);
};
