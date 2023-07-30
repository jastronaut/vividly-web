import { useState, useEffect } from 'react';
import {
	Modal,
	Center,
	Text,
	Stack,
	Flex,
	Button,
	Space,
	NativeSelect,
	Title,
	Textarea,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { makeApiCall } from '@/utils';
import { DefaultResponse } from '@/types/api';
import { useCurUserContext } from '../contexts/CurUserContext';

const ReasonOptions = ['Harassment', 'Spam', 'Inappropriate content', 'Other'];

export enum ReportType {
	POST = 'post',
	COMMENT = 'comment',
	USER = 'user',
}

type Props = {
	isOpen: boolean;
	onNo: () => void;
	onYes: () => void;
	reportType: ReportType;
	username: string;
	userId: number;
	postId?: number;
	commentId?: number;
};

// separated this out to use both in the post composer and comment composer
export const ReportModal = (props: Props) => {
	const [reason, setReason] = useState<string>(ReasonOptions[0]);
	const [comment, setComment] = useState<string>('');
	const [errorText, setErrorText] = useState<string>('');
	let message = '';

	const { token } = useCurUserContext().curUser;

	switch (props.reportType) {
		case ReportType.POST:
			message = `Report @${props.username}'s post?`;
			break;
		case ReportType.COMMENT:
			message = `Report @${props.username}'s comment?`;
			break;
		case ReportType.USER:
			message = `Report @${props.username}?`;
			break;
		default:
			message = 'Unknown report type';
			break;
	}

	const submitReport = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorText('');

		try {
			if (!comment || !reason) {
				setErrorText('Please fill out all fields');
				return;
			}

			const body = {
				reason,
				comment,
				itemId: props.postId || props.commentId || props.userId,
				itemType: props.reportType,
			};

			const res = await makeApiCall<DefaultResponse>({
				uri: '/reports',
				method: 'POST',
				body,
				token,
			});

			if (!res.success) {
				throw new Error(res.error);
			}

			props.onNo();
			notifications.show({
				title: 'Report submitted',
				message: 'Thank you for your feedback!',
				color: 'green',
				autoClose: 5000,
			});
		} catch (error) {
			console.error(error);
			setErrorText('Something went wrong. Please try again!');
		}
	};

	useEffect(() => {
		setErrorText('');
		setReason(ReasonOptions[0]);
		setComment('');
	}, [props.isOpen]);

	return (
		<Modal
			opened={props.isOpen}
			onClose={props.onNo}
			centered
			size='sm'
			withCloseButton={false}
		>
			<Center>
				<Stack>
					<Title ta='center' style={{ marginBottom: '0' }} order={3}>
						{message}
					</Title>

					<form onSubmit={submitReport}>
						<NativeSelect
							data={ReasonOptions}
							label='Select a reason'
							withAsterisk
							required
							onChange={e => setReason(e.currentTarget.value)}
						/>
						<Textarea
							label='Additional information'
							withAsterisk
							required
							maxLength={500}
							onChange={e => setComment(e.currentTarget.value)}
						/>

						{errorText && (
							<Text ta='center' color='red'>
								{errorText}
							</Text>
						)}
						<Space h='md' />
						<Center>
							<Flex>
								<Button radius='lg' color='red' type='submit'>
									Submit
								</Button>
								<Space w='md' />
								<Button radius='lg' color='gray' onClick={props.onNo}>
									Cancel
								</Button>
							</Flex>
						</Center>
					</form>
				</Stack>
			</Center>
		</Modal>
	);
};
