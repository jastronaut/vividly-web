import React, { useState, useEffect } from 'react';
import {
	createEditor,
	Descendant,
	Element as ElementType,
	Editor as SlateEditorType,
} from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import * as linkify from 'linkifyjs';
import dayjs from 'dayjs';

import { Text, Modal, Button, Flex, Space, ActionIcon } from '@mantine/core';
import {
	IconPhoto,
	IconCalendar,
	IconTemperature,
	IconClockHour9,
} from '@tabler/icons-react';

import { BlockType as EditorBlockType } from '../../types/editor';
import { EditorContainer, MagicTextWrapper } from './styles';
import { ImageBlock as ImageBlockContent } from '../post/blocks/blocks';
import { LinkBlockContent } from '../post/blocks/LinkBlockContent';
import { DismissWarningModal } from '../DismissWarningModal';
import { getWeatherEmoji, kelvinToFahrenheit } from './utils';
import { Block, BlockType } from '@/types/post';

import { OpenWeatherResponse } from '../../types/editor';

const openWeatherKey =
	process.env.REACT_APP_OPEN_WEATHER_API_KEY ||
	process.env.OPEN_WEATHER_API_KEY ||
	'1a627ae47875ec32d233bc89daf79e62';

const LinkBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	if (element.type !== EditorBlockType.LINK) {
		return null;
	}

	return (
		<div {...attributes}>
			<div contentEditable={false}>
				{element.url}
				<LinkBlockContent {...element} />
			</div>
			{children}
		</div>
	);
};

const MagicBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	if (element.type !== EditorBlockType.MAGIC) {
		return null;
	}

	return (
		<div {...attributes}>
			<div contentEditable={false}>
				<MagicTextWrapper>
					<Text style={{ display: 'inline' }}>{element.data}</Text>
				</MagicTextWrapper>
			</div>

			{children}
		</div>
	);
};

const ImageBlock = (props: BaseElementProps) => {
	const { attributes, children, element } = props;
	// const editor = useSlateStatic();
	// const path = ReactEditor.findPath(editor, element);

	// const selected = useSelected();
	// const focused = useFocused();
	if (element.type !== EditorBlockType.IMAGE) {
		return null;
	}

	return (
		<div {...attributes}>
			{children}
			<div
				contentEditable={false}
				style={{
					position: 'relative',
				}}
			>
				<ImageBlockContent
					url={element.url}
					width={element.width}
					height={element.height}
				/>
				{/* <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={css`
            display: ${selected && focused ? 'inline' : 'none'};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
          `}
        >
          <Icon>delete</Icon>
        </Button> */}
			</div>
		</div>
	);
};

const withEmbeds = (props: SlateEditorType) => {
	const editor = props;
	const { isVoid } = editor;
	editor.isVoid = element =>
		element.type === EditorBlockType.IMAGE ||
		element.type === EditorBlockType.LINK
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
	const [editor] = useState(() => withReact(withEmbeds(createEditor())));

	const finishAddingBlock = () => {
		editor.insertNode({
			type: EditorBlockType.TEXT,
			children: [{ text: '' }],
		});
		editor.insertBreak();

		ReactEditor.focus(editor);
	};

	const addImage = () => {
		editor.insertNode({
			type: EditorBlockType.IMAGE,
			url: 'https://i.ibb.co/CnxM4Hj/grid-0-2.jpg',
			width: 100,
			height: 100,
			children: [{ text: '' }],
		});

		finishAddingBlock();
	};

	const onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
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

				editor.insertNode({
					type: EditorBlockType.LINK,
					url,
					children: [{ text: url }],
				});
			}
		}

		finishAddingBlock();
	};

	const addDate = () => {
		const now = dayjs().format('dddd, MMMM D, YYYY');
		const formattedDate = `📰 ${now}`;
		editor.insertNode({
			type: EditorBlockType.MAGIC,
			data: formattedDate,
			children: [{ text: '' }],
		});
		finishAddingBlock();
	};

	const addTime = () => {
		const now = dayjs().format('h:mm A');
		const formattedTime = `🕓 ${now}`;
		editor.insertNode({
			type: EditorBlockType.MAGIC,
			data: formattedTime,
			children: [{ text: '' }],
		});
		finishAddingBlock();
	};

	const addWeather = () => {
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
					editor.insertNode({
						type: EditorBlockType.MAGIC,
						data: `${emoji} ${temp}º F`,
						children: [{ text: '' }],
					});
				});
		};

		navigator.geolocation.getCurrentPosition(positionSuccess, e =>
			console.error('Couldnt get location', e)
		);
		finishAddingBlock();
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
						onPaste={onPaste}
						autoFocus
					/>
				</Slate>
			</EditorContainer>
			<Space h='md' />
			<Flex gap='md'>
				<ActionIcon
					variant='light'
					radius='xl'
					color='grape'
					size='lg'
					onClick={addImage}
					title='Add Image'
				>
					<IconPhoto />
				</ActionIcon>
				<ActionIcon
					variant='light'
					radius='xl'
					color='grape'
					size='lg'
					onClick={addTime}
					title='Add Current Time'
				>
					<IconClockHour9 />
				</ActionIcon>
				<ActionIcon
					variant='light'
					radius='xl'
					color='grape'
					size='lg'
					onClick={addDate}
					title='Add Current Date'
				>
					<IconCalendar />
				</ActionIcon>
				<ActionIcon
					variant='light'
					radius='xl'
					color='grape'
					size='lg'
					onClick={addWeather}
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
		if (isWarningModalOpen) {
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

		props.onSubmit(blocks);
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
