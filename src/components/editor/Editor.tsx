import React, {
	useState,
	useCallback,
	useMemo,
	useEffect,
	useRef,
} from 'react';
import {
	BaseEditor,
	createEditor,
	Descendant,
	Element as ElementType,
	Editor as SlateEditorType,
	Range,
	Transforms,
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
	Portal,
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

import { EditorBlockType, MusicElement } from '../../types/editor';
import {
	EditorContainer,
	InlineEditorWrapper,
	NamesDropdownOption,
	NamesDropdownContainer,
} from './styles';
import { DismissWarningModal } from '../common/DismissWarningModal';
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
	withEmbeds,
} from './utils';
import { Block, BlockType } from '@/types/post';

import { OpenWeatherResponse } from '../../types/editor';

import {
	ImageBlock,
	LinkBlock,
	MagicBlock,
	OracleBlock,
	MusicBlock,
	QuoteBlock,
} from './Nodes';
import { showAndLogErrorNotification } from '@/showerror';
import { MusicInput, OracleInput } from './MagicActions';
import { useVividlyTheme } from '@/styles/Theme';

type TheEditor = BaseEditor & ReactEditor & HistoryEditor;

const insertMention = (editor: TheEditor, character: string) => {
	SlateEditorType.insertText(editor, `@${character} `);
};

const openWeatherKey =
	process.env.REACT_APP_OPEN_WEATHER_API_KEY ||
	process.env.OPEN_WEATHER_API_KEY ||
	process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;

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
		case EditorBlockType.QUOTE:
			return <QuoteBlock {...props} />;
		default:
			return <Text {...attributes}>{children}</Text>;
	}
};

type EditorWithActionsProps = {
	initialValue: Descendant[];
	onChange: (value: any) => void;
	editor: BaseEditor & ReactEditor & HistoryEditor;
	friendsNames: {
		username: string;
		name: string;
	}[];
	onClickMagicPostActions: () => void;
};

export const EditorWithActions = (props: EditorWithActionsProps) => {
	const { editor } = props;
	const [isOracleInputVisible, setIsOracleInputVisible] = useState(false);
	const [isMusicInputVisible, setIsMusicInputVisible] = useState(false);
	const [target, setTarget] = useState<Range | null>(null);
	const [searchName, setSearchName] = useState<string | null>(null);
	const [namesIndex, setNamesIndex] = useState(0);
	const ref = useRef<HTMLDivElement | null>(null);

	const { accentColor } = useVividlyTheme();

	const chars = searchName
		? props.friendsNames.filter(
				friend =>
					friend.name.toLowerCase().includes(searchName.toLowerCase()) ||
					friend.username.toLowerCase().includes(searchName.toLowerCase())
		  )
		: [];

	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (target && chars.length > 0) {
				switch (event.key) {
					case 'ArrowDown':
						event.preventDefault();
						const prevIndex = namesIndex + 1;
						setNamesIndex(prevIndex >= chars.length ? 0 : prevIndex);
						break;
					case 'ArrowUp':
						event.preventDefault();
						const nextIndex = namesIndex - 1;
						setNamesIndex(nextIndex < 0 ? chars.length - 1 : nextIndex);
						break;
					case 'Tab':
					case 'Enter':
						event.preventDefault();
						Transforms.select(editor, target);
						insertMention(editor, chars[namesIndex].username);
						setTarget(null);
						setNamesIndex(0);
						setSearchName(null);
						break;
					case 'Escape':
						event.preventDefault();
						setTarget(null);
						break;
				}
			}
		},
		[chars, namesIndex, target]
	);

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
			props.onClickMagicPostActions();
			setIsOracleInputVisible(true);
			setIsMusicInputVisible(false);
		}
	};

	const toggleMusicInput = () => {
		if (isMusicInputVisible) {
			setIsMusicInputVisible(false);
		} else {
			props.onClickMagicPostActions();
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
		toggleMusicInput();
	};

	const mentionsVisible = target && chars.length > 0;

	const actionIconProps = {
		radius: 'xl' as const,
		size: 'lg' as const,
		color: accentColor,
	};

	useEffect(() => {
		const el = ref.current;
		if (target && chars.length > 0 && el) {
			const domRange = ReactEditor.toDOMRange(editor, target);
			const rect = domRange.getBoundingClientRect();
			el.style.top = `${rect.top + window.pageYOffset + 24}px`;
			el.style.left = `${rect.left + window.pageXOffset}px`;
		}
	}, [chars.length, editor, namesIndex, searchName, target]);

	useEffect(() => {
		props.onClickMagicPostActions();
	}, [isOracleInputVisible, isMusicInputVisible]);

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
						const { selection } = editor;

						if (selection && Range.isCollapsed(selection)) {
							const [start] = Range.edges(selection);
							const wordBefore = SlateEditorType.before(editor, start, {
								unit: 'word',
							});
							const before =
								wordBefore && SlateEditorType.before(editor, wordBefore);
							const beforeRange =
								before && SlateEditorType.range(editor, before, start);
							const beforeText =
								beforeRange && SlateEditorType.string(editor, beforeRange);
							const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
							const after = SlateEditorType.after(editor, start);
							const afterRange = SlateEditorType.range(editor, start, after);
							const afterText = SlateEditorType.string(editor, afterRange);
							const afterMatch = afterText.match(/^(\s|$)/);

							if (beforeMatch && afterMatch) {
								setTarget(beforeRange);
								setSearchName(beforeMatch[1]);
								setNamesIndex(0);
								return;
							}
						}

						// setNamesIndex(0);
						// setSearchName(null);

						setTarget(null);
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
						onKeyDown={onKeyDown}
						autoFocus
					/>
				</Slate>
				{mentionsVisible ? (
					<Portal>
						<NamesDropdownContainer ref={ref} data-cy='mentions-portal'>
							{chars.map((char, i) => (
								<NamesDropdownOption
									key={char.username}
									onClick={() => {
										if (!target) return;
										Transforms.select(editor, target);
										insertMention(editor, char.username);
										setTarget(null);
									}}
									isHighlighted={i === namesIndex}
								>
									<Text className='friend-name'>{char.name}</Text>
									<Text className='friend-username'>{` @${char.username}`}</Text>
								</NamesDropdownOption>
							))}
						</NamesDropdownContainer>
					</Portal>
				) : null}
			</EditorContainer>
			<Space h='sm' />
			<Flex gap='md'>
				<Tooltip label='Add an image' position='bottom' withArrow>
					<FileButton
						onChange={(f: File | null) => addImage(editor, f)}
						accept='image/png,image/jpeg'
					>
						{props => (
							<ActionIcon
								aria-label='Upload image'
								{...actionIconProps}
								{...props}
							>
								<IconPhoto />
							</ActionIcon>
						)}
					</FileButton>
				</Tooltip>
				<Tooltip label='Add current time' position='bottom' withArrow>
					<ActionIcon
						{...actionIconProps}
						variant='light'
						onClick={() => addTime(editor)}
						aria-label='Add current time'
					>
						<IconClockHour9 />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Add current date' position='bottom' withArrow>
					<ActionIcon
						{...actionIconProps}
						variant='light'
						onClick={() => addDate(editor)}
						aria-label='Add current date'
					>
						<IconCalendar />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Add current weather' position='bottom' withArrow>
					<ActionIcon
						{...actionIconProps}
						variant='light'
						onClick={() => addWeather(editor)}
						aria-label='Add current weather'
					>
						<IconTemperature />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Ask the oracle a question' position='bottom' withArrow>
					<ActionIcon
						variant={isOracleInputVisible ? 'filled' : 'light'}
						{...actionIconProps}
						onClick={toggleOracleInput}
						aria-label='Ask the oracle'
					>
						<IconCrystalBall />
					</ActionIcon>
				</Tooltip>

				<Tooltip label='Add a song' position='bottom' withArrow>
					<ActionIcon
						variant={isMusicInputVisible ? 'filled' : 'light'}
						{...actionIconProps}
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

type EditorProps = {
	isOpen: boolean;
	onChange: (value: any) => void;
	onSubmit: (value: Block[]) => void;
	friendsList: {
		name: string;
		username: string;
	}[];
	onClickMagicPostActions: () => void;
	editor: TheEditor;
};

export const Editor = (props: EditorProps) => {
	const { editor } = props;
	const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
	// const [editor] = useState(() =>
	// withHistory(withReact(withEmbeds(createEditor())))
	// );
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
				case EditorBlockType.QUOTE:
					blocks.push({
						type: BlockType.QUOTE,
						postId: node.postId,
						preview: node.preview,
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
				friendsNames={props.friendsList}
				onClickMagicPostActions={props.onClickMagicPostActions}
			/>
			<Flex justify='flex-end'>
				<Button
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
