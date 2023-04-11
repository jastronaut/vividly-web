import { useState } from 'react';
import { Modal, Space, Text } from '@mantine/core';

import { Comment as CommentType } from '@/types/post';
import { DismissWarningModal } from '@/components/DismissWarningModal';
import { Comment } from './Comment';

import { AllComments } from './styles';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { NewCommentInput } from './NewCommentInput';

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
	const { curUser } = useCurUserContext();

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
						canDelete={
							props.isPostAuthor ||
							(curUser ? curUser.user.id === comment.authorId : false)
						}
					/>
				))}
				{props.comments.length === 0 && <EmptyCommentsState />}
				{props.commentsDisabledForFriends && <DisabledCommentsState />}
			</AllComments>
			<NewCommentInput
				onSubmit={props.onSubmit}
				disabled={props.commentsDisabledForFriends && !props.isPostAuthor}
			/>
		</Modal>
	);
};
