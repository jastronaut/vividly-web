import React from 'react';
import { Modal, Center, Text, Stack, Flex, Button, Space } from '@mantine/core';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onDeleteDraft: () => void;
	message: string;
};

// separated this out to use both in the post composer and comment composer
export const DismissWarningModal = (props: Props) => {
	return (
		<Modal
			opened={props.isOpen}
			onClose={() => {}}
			centered
			size='sm'
			withCloseButton={false}
		>
			<Center>
				<Stack>
					<Text style={{ marginBottom: '0' }}>{props.message}</Text>
					<Center>
						<Flex>
							<Button radius='xl' color='red' onClick={props.onDeleteDraft}>
								Yep
							</Button>
							<Space w='md' />
							<Button radius='xl' color='gray' onClick={props.onClose}>
								Nope
							</Button>
						</Flex>
					</Center>
				</Stack>
			</Center>
		</Modal>
	);
};
