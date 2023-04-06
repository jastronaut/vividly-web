import { useState } from 'react';
import { Button, Flex, Modal, Space, Text } from '@mantine/core';

import { Comment as CommentType } from '@/types/post';
import { DismissWarningModal } from '@/components/DismissWarningModal';
import { Comment } from './Comment';

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

const DisabledCommentsState = () => {
	return (
		<>
			<Space h='sm' />
			<Text c='dimmed' style={{ textAlign: 'center' }}>
				New comments on this post are limited.
			</Text>
			<Space h='sm' />
		</>
	);
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
	comments: CommentType[];
	onSubmit: (comment: string) => void;
	onDelete: (id: string) => void;
	isPostAuthor: boolean;
	commentsDisabledForFriends: boolean;
};

export const CommentsModal = (props: Props) => {
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
						onClickLink={props.onClose}
					/>
				))}
				{props.comments.length === 0 && <EmptyCommentsState />}
				{props.commentsDisabledForFriends && <DisabledCommentsState />}
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
						maxLength={500}
						onChange={e => setDraft(e.currentTarget.value)}
						disabled={!props.isPostAuthor && props.commentsDisabledForFriends}
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
