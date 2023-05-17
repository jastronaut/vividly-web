import React, { useState, useEffect } from 'react';
import {
	createEditor,
	Descendant,
	Element as ElementType,
	Editor as SlateEditorType,
} from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import * as linkify from 'linkifyjs';
import dayjs from 'dayjs';
import {
	Text,
	Modal,
	Button,
	Flex,
	Space,
	ActionIcon,
	FileButton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
	IconPhoto,
	IconCalendar,
	IconTemperature,
	IconClockHour9,
	IconX,
} from '@tabler/icons-react';

import { BlockType as EditorBlockType } from '../../types/editor';
import { EditorContainer } from './styles';
import { DismissWarningModal } from '../DismissWarningModal';
import {
	getWeatherEmoji,
	kelvinToFahrenheit,
	addDate,
	addTime,
	removeBlankBlock,
	finishAddingBlock,
	addLink,
	addImage,
} from './utils';
import { Block, BlockType } from '@/types/post';

import { OpenWeatherResponse } from '../../types/editor';

import { ImageBlock, LinkBlock, MagicBlock } from './Nodes';

const openWeatherKey =
	process.env.REACT_APP_OPEN_WEATHER_API_KEY ||
	process.env.OPEN_WEATHER_API_KEY ||
	process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;

const withEmbeds = (props: SlateEditorType) => {
	const editor = props;
	const { isVoid } = editor;
	editor.isVoid = element =>
		element.type === EditorBlockType.IMAGE ||
		element.type === EditorBlockType.LINK ||
		element.type === EditorBlockType.MAGIC
			? true
			: isVoid(element);
	return editor;
};

interface BaseElementProps {
	children: React.ReactNode;
	attributes: any;
	element: ElementType;
}

const Element = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	switch (element.type) {
		case EditorBlockType.IMAGE:
			return <ImageBlock {...props} />;
		case EditorBlockType.LINK:
			return <LinkBlock {...props} />;
		case EditorBlockType.MAGIC:
			return <MagicBlock {...props} />;
		default:
			return <Text {...attributes}>{children}</Text>;
	}
};

type EditorProps = {
	initialValue: Descendant[];
	onChange: (value: any) => void;
};

const Editor = (props: EditorProps) => {
	const [editor] = useState(() =>
		withHistory(withReact(withEmbeds(createEditor())))
	);
	const [file, setFile] = useState<File | null>(null);

	const onPaste = (
		event: React.ClipboardEvent<HTMLDivElement>,
		editor: ReactEditor
	) => {
		const { clipboardData } = event;
		if (!clipboardData) {
			ReactEditor.focus(editor);
			return;
		}

		const text = clipboardData.getData('text/plain');

		if (!text) {
			ReactEditor.focus(editor);
			return;
		}

		const links = linkify.find(text);
		if (links.length > 0) {
			const link = links[0];
			const url = link.href;
			if (url) {
				event.preventDefault();
				addLink(editor, url);
			}
		}
	};

	const addWeather = (editor: ReactEditor) => {
		const positionSuccess = (position: GeolocationPosition) => {
			const { longitude, latitude } = position.coords;

			fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}`
			)
				.then(resp => resp.json())
				.then((data: OpenWeatherResponse) => {
					if (data.cod !== 200) {
						throw Error(`Couldn't get weather`);
					}
					const temp = kelvinToFahrenheit(data.main.temp);
					const hour = parseInt(dayjs().format('H'));
					const emoji = getWeatherEmoji(data.weather[0], hour);
					const displayText = `${emoji} ${temp}º F`;

					removeBlankBlock(editor);
					editor.insertNode({
						type: EditorBlockType.MAGIC,
						data: displayText,
						children: [{ text: displayText }],
					});
					finishAddingBlock(editor);
				});
		};

		navigator.geolocation.getCurrentPosition(positionSuccess, e => {
			console.error('Couldnt get location', e);
			console.error('🟣 Vividly Error: ', e);
			notifications.show({
				title: 'Error',
				message: 'Could not get location',
				color: 'red',
				icon: <IconX />,
			});
		});
	};

	useEffect(() => {
		ReactEditor.focus(editor);
	}, [editor]);

	return (
		<>
			<EditorContainer>
				<Slate
					editor={editor}
					value={props.initialValue}
					onChange={value => {
						const isAstChange = editor.operations.some(
							op => 'set_selection' !== op.type
						);
						if (isAstChange) {
							props.onChange(value);
						}
					}}
				>
					<Editable
						style={{
							minHeight: '150px',
							maxHeight: '300px',
							overflow: 'auto',
						}}
						renderElement={props => <Element {...props} />}
						placeholder='Write something...'
						onPaste={(event: React.ClipboardEvent<HTMLDivElement>) =>
							onPaste(event, editor)
						}
						autoFocus
					/>
				</Slate>
			</EditorContainer>
			<Space h='md' />
			<Flex gap='md'>
				<FileButton
					onChange={(f: File | null) => addImage(editor, f)}
					accept='image/png,image/jpeg'
				>
					{props => (
						<ActionIcon
							variant='light'
							radius='xl'
							color='grape'
							size='lg'
							// onClick={() => addImage(editor)}
							title='Add Image'
							{...props}
						>
							<IconPhoto />
						</ActionIcon>
					)}
				</FileButton>
				<ActionIcon
					variant='light'
					radius='xl'
					color='grape'
					size='lg'
					onClick={() => addTime(editor)}
					title='Add Current Time'
				>
					<IconClockHour9 />
				</ActionIcon>
				<ActionIcon
					variant='light'
					radius='xl'
					color='grape'
					size='lg'
					onClick={() => addDate(editor)}
					title='Add Current Date'
				>
					<IconCalendar />
				</ActionIcon>
				<ActionIcon
					variant='light'
					radius='xl'
					color='grape'
					size='lg'
					onClick={() => addWeather(editor)}
					title='Add Current Weather'
				>
					<IconTemperature />
				</ActionIcon>
			</Flex>
		</>
	);
};

type EditorModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onChange: (value: any) => void;
	onSubmit: (value: Block[]) => void;
};

export const EditorModal = (props: EditorModalProps) => {
	const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
	const [draft, setDraft] = useState<ElementType[]>([]);

	const tryDismissModal = () => {
		if (isWarningModalOpen || draft.length === 0) {
			props.onClose();
			return;
		}

		if (
			draft.length === 1 &&
			draft[0].type === EditorBlockType.TEXT &&
			draft[0].children[0].text === ''
		) {
			props.onClose();
			return;
		}

		setIsWarningModalOpen(true);
	};

	const processDraftAndSubmit = () => {
		const blocks: Block[] = [];

		for (const node of draft) {
			switch (node.type) {
				case EditorBlockType.TEXT:
					const text = node.children[0].text;
					blocks.push({
						type: BlockType.TEXT,
						text,
					});
					break;
				case EditorBlockType.IMAGE:
					blocks.push({
						type: BlockType.IMAGE,
						url: node.url,
						width: node.width,
						height: node.height,
					});
					break;
				case EditorBlockType.MAGIC:
					blocks.push({
						type: BlockType.TEXT,
						text: node.data,
					});
					break;
				case EditorBlockType.LINK:
					blocks.push({
						type: BlockType.LINK,
						url: node.url,
						description: node.description,
						imageURL: node.imageURL,
						title: node.title,
					});
					break;
				default:
					break;
			}
		}

		console.log(blocks);
		// props.onSubmit(blocks);
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
				onNo={() => setIsWarningModalOpen(false)}
				onYes={() => {
					props.onClose();
					setIsWarningModalOpen(false);
				}}
				message='Abandon this post? 😳'
			/>
			<Space h='xl' />
			<Editor
				initialValue={[
					{
						type: EditorBlockType.TEXT,
						children: [{ text: '' }],
					},
				]}
				onChange={setDraft}
			/>
			<Space h='md' />
			<Flex justify='flex-end'>
				<Button color='grape' radius='lg' onClick={processDraftAndSubmit}>
					Post
				</Button>
			</Flex>
		</Modal>
	);
};

export default Editor;
