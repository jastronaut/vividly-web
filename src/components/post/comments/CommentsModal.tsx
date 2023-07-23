import { useState, useCallback } from 'react';
import { Modal, Space, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';

import { Comment as CommentType } from '@/types/post';
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
	onDelete: (id: number) => void;
	isPostAuthor: boolean;
	commentsDisabledForFriends: boolean;
};

export const CommentsModal = (props: Props) => {
	const [draft, setDraft] = useState('');
	const { curUser } = useCurUserContext();
	const isMobile = useMediaQuery('(max-width: 800px)');
	const { onClose } = props;

	const close = () => {
		setDraft('');
		onClose();
	};

	const tryClose = useCallback(() => {
		if (draft.length > 1) {
			modals.openConfirmModal({
				centered: true,
				children: <Text ta='center'>Abandon your comment?</Text>,
				labels: { confirm: 'Confirm', cancel: 'Cancel' },
				confirmProps: { color: 'red' },
				onCancel: () => {},
				onConfirm: () => close(),
				withCloseButton: false,
			});
		} else {
			close();
		}
	}, [draft, onClose]);

	return (
		<Modal
			opened={props.isOpen}
			onClose={tryClose}
			centered
			padding={isMobile ? 'md' : 'xl'}
			title='Comments'
			withCloseButton
			zIndex={150}
		>
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
				draft={draft}
				setDraft={setDraft}
				onSubmit={props.onSubmit}
				disabled={props.commentsDisabledForFriends && !props.isPostAuthor}
			/>
			<Space h='xl' />
		</Modal>
	);
};
