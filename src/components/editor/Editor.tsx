import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
	BaseEditor,
	createEditor,
	Descendant,
	Element as ElementType,
	Editor as SlateEditorType,
} from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { HistoryEditor, withHistory } from 'slate-history';
import * as linkify from 'linkifyjs';
import dayjs from 'dayjs';
import {
	Text,
	Button,
	Flex,
	Space,
	ActionIcon,
	FileButton,
	Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
	IconPhoto,
	IconCalendar,
	IconTemperature,
	IconClockHour9,
	IconX,
	IconCrystalBall,
	IconMusic,
} from '@tabler/icons-react';

import { BlockType as EditorBlockType, MusicElement } from '../../types/editor';
import { EditorContainer, InlineEditorWrapper } from './styles';
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
	addOracleResponsePreview,
	generateOracleResponse,
	isDraftEmpty,
	stripBlocks,
} from './utils';
import { Block, BlockType } from '@/types/post';

import { OpenWeatherResponse } from '../../types/editor';

import {
	ImageBlock,
	LinkBlock,
	MagicBlock,
	OracleBlock,
	MusicBlock,
} from './Nodes';
import { showAndLogErrorNotification } from '@/showerror';
import { MusicInput, OracleInput } from './MagicActions';

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
		element.type === EditorBlockType.MAGIC ||
		element.type === EditorBlockType.ORACLE
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
		case EditorBlockType.ORACLE:
			return <OracleBlock {...props} />;
		case EditorBlockType.MUSIC:
			return <MusicBlock {...props} />;
		default:
			return <Text {...attributes}>{children}</Text>;
	}
};

type EditorProps = {
	initialValue: Descendant[];
	onChange: (value: any) => void;
	editor: BaseEditor & ReactEditor & HistoryEditor;
};

export const EditorWithActions = (props: EditorProps) => {
	const { editor } = props;
	const [isOracleInputVisible, setIsOracleInputVisible] = useState(false);
	const [isMusicInputVisible, setIsMusicInputVisible] = useState(false);

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
			const url = link.value;
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

	const toggleOracleInput = () => {
		if (isOracleInputVisible) {
			setIsOracleInputVisible(false);
		} else {
			setIsOracleInputVisible(true);
			setIsMusicInputVisible(false);
		}
	};

	const toggleMusicInput = () => {
		if (isMusicInputVisible) {
			setIsMusicInputVisible(false);
		} else {
			setIsMusicInputVisible(true);
			setIsOracleInputVisible(false);
		}
	};

	const onClickAskOracle = useCallback(
		(question: string) => {
			addOracleResponsePreview(editor, question);
			toggleOracleInput();
		},
		[editor]
	);

	const onClickAddMusic = (music: MusicElement) => {
		removeBlankBlock(editor);
		editor.insertNode(music);
		finishAddingBlock(editor);
		toggleMusicInput;
	};

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
							minHeight: '100px',
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
			<Space h='sm' />
			<Flex gap='md'>
				<FileButton
					onChange={(f: File | null) => addImage(editor, f)}
					accept='image/png,image/jpeg'
				>
					{props => (
						<Tooltip label='Add an image' position='bottom' withArrow>
							<ActionIcon
								variant='light'
								radius='xl'
								color='grape'
								size='lg'
								aria-label='Upload image'
								{...props}
							>
								<IconPhoto />
							</ActionIcon>
						</Tooltip>
					)}
				</FileButton>
				<Tooltip label='Add current time' position='bottom' withArrow>
					<ActionIcon
						variant='light'
						radius='xl'
						color='grape'
						size='lg'
						onClick={() => addTime(editor)}
						aria-label='Add current time'
					>
						<IconClockHour9 />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Add current date' position='bottom' withArrow>
					<ActionIcon
						variant='light'
						radius='xl'
						color='grape'
						size='lg'
						onClick={() => addDate(editor)}
						aria-label='Add current date'
					>
						<IconCalendar />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Add current weather' position='bottom' withArrow>
					<ActionIcon
						variant='light'
						radius='xl'
						color='grape'
						size='lg'
						onClick={() => addWeather(editor)}
						aria-label='Add current weather'
					>
						<IconTemperature />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Ask the oracle a question' position='bottom' withArrow>
					<ActionIcon
						variant={isOracleInputVisible ? 'filled' : 'light'}
						radius='xl'
						color='grape'
						size='lg'
						onClick={toggleOracleInput}
						aria-label='Ask the oracle'
					>
						<IconCrystalBall />
					</ActionIcon>
				</Tooltip>

				<Tooltip label='Add a song' position='bottom' withArrow>
					<ActionIcon
						variant={isMusicInputVisible ? 'filled' : 'light'}
						radius='xl'
						color='grape'
						size='lg'
						onClick={toggleMusicInput}
						title='Add a song'
					>
						<IconMusic />
					</ActionIcon>
				</Tooltip>
			</Flex>
			<OracleInput
				isVisible={isOracleInputVisible}
				onClickAskOracle={onClickAskOracle}
			/>
			<MusicInput isVisible={isMusicInputVisible} onSubmit={onClickAddMusic} />
		</>
	);
};

type EditorModalProps = {
	isOpen: boolean;
	onChange: (value: any) => void;
	onSubmit: (value: Block[]) => void;
};

export const Editor = (props: EditorModalProps) => {
	const [editor] = useState(() =>
		withHistory(withReact(withEmbeds(createEditor())))
	);
	const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
	const [draft, setDraft] = useState<ElementType[]>([]);
	const draftEmpty = useMemo(() => isDraftEmpty(draft), [draft]);

	// todo: make this work when leaving the page
	const tryDismissModal = () => {
		if (isWarningModalOpen || draftEmpty) {
			return;
		}
		setIsWarningModalOpen(true);
	};

	const processDraftAndSubmit = useCallback(() => {
		if (draftEmpty) {
			return;
		}

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
				case EditorBlockType.ORACLE:
					blocks.push({
						type: BlockType.TEXT,
						text: `☁️ ${node.question}\n🔮 ${generateOracleResponse()}`,
					});
					break;
				case EditorBlockType.MUSIC:
					blocks.push({
						type: BlockType.MUSIC,
						appleMusicEmbedUrl: node.appleMusicEmbedUrl,
						spotifyEmbedUrl: node.spotifyEmbedUrl,
						youtubeEmbedUrl: node.youtubeEmbedUrl,
					});
					break;
				default:
					break;
			}
		}

		const strippedBlocks = stripBlocks(blocks);
		if (strippedBlocks.length < 1) {
			return;
		}

		try {
			props.onSubmit(strippedBlocks);
			setDraft([
				{
					type: EditorBlockType.TEXT,
					children: [{ text: '' }],
				},
			]);

			// clear editor after submitting post
			const point = { path: [0, 0], offset: 0 };
			editor.selection = { anchor: point, focus: point };
			editor.history = { redos: [], undos: [] };
			editor.children = [
				{
					type: EditorBlockType.TEXT,
					children: [{ text: '' }],
				},
			];
		} catch (err) {
			showAndLogErrorNotification('Failed to create post', err);
		}
	}, [draft, editor]);

	useEffect(() => {
		if (ReactEditor.isFocused(editor)) {
			console.log('focused');
		}
	}, [editor]);

	return (
		<InlineEditorWrapper>
			<DismissWarningModal
				isOpen={isWarningModalOpen}
				onNo={() => setIsWarningModalOpen(false)}
				onYes={() => {
					setDraft([
						{
							type: EditorBlockType.TEXT,
							children: [{ text: '' }],
						},
					]);
					setIsWarningModalOpen(false);
				}}
				message='Abandon this post? 😳'
			/>
			<EditorWithActions
				initialValue={[
					{
						type: EditorBlockType.TEXT,
						children: [{ text: '' }],
					},
				]}
				onChange={setDraft}
				editor={editor}
			/>
			<Flex justify='flex-end'>
				<Button
					color='grape'
					radius='lg'
					onClick={processDraftAndSubmit}
					disabled={draftEmpty}
				>
					Post
				</Button>
			</Flex>
		</InlineEditorWrapper>
	);
};
