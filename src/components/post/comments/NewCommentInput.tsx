import { useState } from 'react';
import { Button, Flex } from '@mantine/core';

import { AddCommentContainer, CommentTextArea } from './styles';

type Props = {
	onSubmit: (comment: string) => void;
	disabled?: boolean;
};
export const NewCommentInput = (props: Props) => {
	const { disabled = false } = props;
	const [draft, setDraft] = useState<string>('');
	return (
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
					disabled={disabled}
				/>
				<Flex justify='flex-end'>
					<Button radius='xl' color='grape' type='submit'>
						Send
					</Button>
				</Flex>
			</form>
		</AddCommentContainer>
	);
};
