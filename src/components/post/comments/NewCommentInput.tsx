import { useState, RefObject } from 'react';
import { Button, Flex } from '@mantine/core';

import { AddCommentContainer, CommentTextArea } from './styles';

type Props = {
	onSubmit: (comment: string) => void;
	disabled?: boolean;
	inputRef?: RefObject<HTMLTextAreaElement>;
	draft: string;
	setDraft: (draft: string) => void;
};

export const NewCommentInput = (props: Props) => {
	const { disabled = false, draft, setDraft } = props;

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			props.onSubmit(draft);
			setDraft('');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<AddCommentContainer>
			<form onSubmit={onSubmit}>
				<CommentTextArea
					placeholder='Say something nice'
					autoFocus
					data-autofocus
					value={draft}
					maxLength={500}
					onChange={e => setDraft(e.currentTarget.value)}
					disabled={disabled}
					ref={props.inputRef}
				/>
				<Flex justify='flex-end'>
					<Button
						radius='xl'
						color='grape'
						type='submit'
						disabled={draft.length < 1}
					>
						Send
					</Button>
				</Flex>
			</form>
		</AddCommentContainer>
	);
};
