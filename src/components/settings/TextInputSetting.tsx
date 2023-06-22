import { useState, useMemo } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import {
	Text,
	Flex,
	Button,
	TextInput,
	Space,
	Title,
	Collapse,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type Props = {
	title: string;
	data: string;
	placeholder: string;
	type?: string;
	onSave: (data: string) => void;
};

export const TextInputSetting = (props: Props) => {
	const { title, data, placeholder, type = 'text', onSave } = props;
	const [opened, { toggle }] = useDisclosure(false);
	const [newData, setNewData] = useState('');

	const isDataValid = useMemo(() => {
		if (type === 'email') {
			return (
				newData.includes('@') && newData.includes('.') && newData.length >= 5
			);
		} else {
			return newData.length >= 30;
		}
	}, [newData]);

	return (
		<>
			<Title order={5}>{title}</Title>
			<Flex justify='space-between' align='center'>
				<Text>{data}</Text>
				<Button
					variant='subtle'
					onClick={toggle}
					rightIcon={
						opened ? (
							<IconChevronUp size='1rem' />
						) : (
							<IconChevronDown size='1rem' />
						)
					}
				>
					Edit
				</Button>
			</Flex>
			<Space h='xs' />
			<Collapse in={opened}>
				<Flex justify='space-between' align='center'>
					<TextInput
						placeholder={placeholder}
						type={type}
						value={newData}
						onChange={e => setNewData(e.currentTarget.value)}
						minLength={type === 'email' ? 5 : 30}
					/>
					<Button onClick={() => onSave(newData)} disabled={!isDataValid}>
						Save
					</Button>
				</Flex>
				<Space h='xs' />
			</Collapse>
		</>
	);
};
