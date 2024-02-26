import React, {
	useState,
	useCallback,
	useMemo,
	useEffect,
	useRef,
} from 'react';
import {
	BaseEditor,
	Descendant,
	Element as ElementType,
	Editor as SlateEditorType,
	Range,
	Transforms,
} from 'slate';
import { Slate, Editable, ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
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
import useEmblaCarousel from 'embla-carousel-react';
import {
	IconPhoto,
	IconCalendar,
	IconTemperature,
	IconClockHour9,
	IconX,
	IconCrystalBall,
	IconMusic,
	IconMap2,
	IconGif,
} from '@tabler/icons-react';

import {
	EditorBlockType,
	LocationElement,
	MusicElement,
} from '../../types/editor';
import {
	EditorContainer,
	InlineEditorWrapper,
	NamesDropdownOption,
	NamesDropdownContainer,
	EditorSubmitButtonContainer,
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
	kelvinToCelcius,
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
	LocationBlock,
} from './Nodes';
import { showAndLogErrorNotification } from '@/showerror';
import {
	MusicInput,
	OracleInput,
	LocationSelector,
	GIFSelector,
} from './MagicActions';
import { useVividlyTheme } from '@/styles/Theme';
import { useLocalizationContext } from '../contexts/LocalizationContext';

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
		case EditorBlockType.LOCATION:
			return <LocationBlock {...props} />;
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
	isFullscreen: boolean;
};

type MagicPostActionsInputs = 'oracle' | 'music' | 'location' | 'gif' | 'none';

export const EditorWithActions = (props: EditorWithActionsProps) => {
	const { editor } = props;
	const [isOracleInputVisible, setIsOracleInputVisible] = useState(false);
	const [isMusicInputVisible, setIsMusicInputVisible] = useState(false);
	const [isLocationSelectorVisible, setIsLocationSelectorVisible] =
		useState(false);
	const [isGIFInputVisible, setIsGIFInputVisible] = useState(false);
	const [target, setTarget] = useState<Range | null>(null);
	const [searchName, setSearchName] = useState<string | null>(null);
	const [namesIndex, setNamesIndex] = useState(0);
	const ref = useRef<HTMLDivElement | null>(null);
	const { use24HourTime, useCelsius, dateFormat } = useLocalizationContext();
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
	const [visibleMagicPostActions, setVisibleMagicPostActions] =
		useState<MagicPostActionsInputs>('none');

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
					const temp = useCelsius
						? kelvinToCelcius(data.main.temp)
						: kelvinToFahrenheit(data.main.temp);
					const hour = parseInt(dayjs().format('H'));
					const emoji = getWeatherEmoji(data.weather[0], hour);
					const displayText = `${emoji} ${temp}º ${useCelsius ? 'C' : 'F'}`;

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
			setIsGIFInputVisible(false);
		}
	};

	const toggleMusicInput = () => {
		if (isMusicInputVisible) {
			setIsMusicInputVisible(false);
		} else {
			props.onClickMagicPostActions();
			setIsMusicInputVisible(true);
			setIsOracleInputVisible(false);
			setIsGIFInputVisible(false);
		}
	};

	const toggleLocationSelector = () => {
		if (isLocationSelectorVisible) {
			setIsLocationSelectorVisible(false);
		} else {
			props.onClickMagicPostActions();
			setIsLocationSelectorVisible(true);
			setIsOracleInputVisible(false);
			setIsMusicInputVisible(false);
		}
	};

	const toggleGIFInput = () => {
		if (isGIFInputVisible) {
			setIsGIFInputVisible(false);
		} else {
			props.onClickMagicPostActions();
			setIsGIFInputVisible(true);
			setIsOracleInputVisible(false);
			setIsLocationSelectorVisible(false);
			setIsMusicInputVisible(false);
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

	const onSelectLocation = (location: LocationElement) => {
		removeBlankBlock(editor);
		editor.insertNode(location);
		finishAddingBlock(editor);
		toggleLocationSelector();
	};

	const onSelectGIF = (url: string, width: number, height: number) => {
		const img: ElementType = {
			type: EditorBlockType.IMAGE,
			url,
			width,
			height,
			children: [{ text: '' }],
			thumbnailURL: url,
		};
		removeBlankBlock(editor);
		Transforms.insertNodes(editor, img);
		finishAddingBlock(editor);
		toggleGIFInput();
	};

	const toggleMagicPostActions = (newAction: MagicPostActionsInputs) => {
		setVisibleMagicPostActions(action =>
			action === newAction ? 'none' : newAction
		);
	};

	const mentionsVisible = target && chars.length > 0;

	const actionIconProps = {
		radius: 'xl' as const,
		size: 'lg' as const,
		color: accentColor,
		variant: 'light' as const,
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
	}, [visibleMagicPostActions]);

	return (
		<>
			<EditorContainer $isFullscreen>
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
									$isHighlighted={i === namesIndex}
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

			<div className='embla' ref={emblaRef}>
				<div className='embla__container'>
					<Flex gap='md'>
						<div className='embla__slide'>
							<FileButton
								onChange={(f: File | null) => addImage(editor, f)}
								accept='image/png,image/jpeg'
							>
								{props => (
									<Tooltip label='Add an image' position='bottom' withArrow>
										<ActionIcon
											aria-label='Upload image'
											{...actionIconProps}
											{...props}
										>
											<IconPhoto />
										</ActionIcon>
									</Tooltip>
								)}
							</FileButton>
						</div>
						<div className='embla__slide'>
							<Tooltip label='Add current time' position='bottom' withArrow>
								<ActionIcon
									{...actionIconProps}
									onClick={() => addTime(editor, use24HourTime)}
									aria-label='Add current time'
								>
									<IconClockHour9 />
								</ActionIcon>
							</Tooltip>
						</div>
						<div className='embla__slide'>
							<Tooltip label='Add current date' position='bottom' withArrow>
								<ActionIcon
									{...actionIconProps}
									onClick={() => addDate(editor, dateFormat)}
									aria-label='Add current date'
								>
									<IconCalendar />
								</ActionIcon>
							</Tooltip>
						</div>
						<div className='embla__slide'>
							<Tooltip label='Add current weather' position='bottom' withArrow>
								<ActionIcon
									{...actionIconProps}
									onClick={() => addWeather(editor)}
									aria-label='Add current weather'
								>
									<IconTemperature />
								</ActionIcon>
							</Tooltip>
						</div>

						<div className='embla__slide'>
							<Tooltip
								label='Ask the oracle a question'
								position='bottom'
								withArrow
							>
								<ActionIcon
									{...actionIconProps}
									variant={
										visibleMagicPostActions === 'oracle' ? 'filled' : 'light'
									}
									onClick={() => toggleMagicPostActions('oracle')}
									aria-label='Ask the oracle'
								>
									<IconCrystalBall />
								</ActionIcon>
							</Tooltip>
						</div>

						<div className='embla__slide'>
							<Tooltip label='Add a song' position='bottom' withArrow>
								<ActionIcon
									{...actionIconProps}
									variant={
										visibleMagicPostActions === 'music' ? 'filled' : 'light'
									}
									onClick={() => toggleMagicPostActions('music')}
									title='Add a song'
								>
									<IconMusic />
								</ActionIcon>
							</Tooltip>
						</div>

						<div className='embla__slide'>
							<Tooltip label='Add current location' position='bottom' withArrow>
								<ActionIcon
									{...actionIconProps}
									variant={
										visibleMagicPostActions === 'location' ? 'filled' : 'light'
									}
									onClick={() => toggleMagicPostActions('location')}
									title='Add current location'
								>
									<IconMap2 />
								</ActionIcon>
							</Tooltip>
						</div>

						<div className='embla__slide'>
							<Tooltip label='Add a gif' position='bottom' withArrow>
								<ActionIcon
									{...actionIconProps}
									variant={
										visibleMagicPostActions === 'gif' ? 'filled' : 'light'
									}
									onClick={() => toggleMagicPostActions('gif')}
									title='Add a gif'
								>
									<IconGif />
								</ActionIcon>
							</Tooltip>
						</div>
					</Flex>
				</div>
			</div>
			<OracleInput
				isVisible={visibleMagicPostActions === 'oracle'}
				onClickAskOracle={onClickAskOracle}
			/>
			<MusicInput
				isVisible={visibleMagicPostActions === 'music'}
				onSelect={onClickAddMusic}
			/>
			<LocationSelector
				isVisible={visibleMagicPostActions === 'location'}
				onSelect={onSelectLocation}
			/>
			<GIFSelector
				isVisible={visibleMagicPostActions === 'gif'}
				onSelect={onSelectGIF}
			/>
		</>
	);
};

type EditorProps = {
	onChange: (value: any) => void;
	onSubmit: (value: Block[]) => void;
	friendsList: {
		name: string;
		username: string;
	}[];
	onClickMagicPostActions: () => void;
	editor: TheEditor;
	initialValue?: Descendant[];
	isFullscreen?: boolean;
};

export const Editor = (props: EditorProps) => {
	const { editor, isFullscreen = false } = props;
	const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
	// const [editor] = useState(() =>
	// withHistory(withReact(withEmbeds(createEditor())))
	// );
	const [draft, setDraft] = useState<ElementType[]>([]);
	const draftEmpty = useMemo(() => isDraftEmpty(draft), [draft]);

	const initialValue = props.initialValue || [
		{
			type: EditorBlockType.TEXT,
			children: [{ text: '' }],
		},
	];

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
				case EditorBlockType.LOCATION:
					blocks.push({
						type: BlockType.LOCATION,
						region: node.region,
						locality: node.locality,
						name: node.name,
						icon: node.icon,
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
		<InlineEditorWrapper $isFullscreen={isFullscreen}>
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
				initialValue={initialValue}
				onChange={setDraft}
				editor={editor}
				friendsNames={props.friendsList}
				onClickMagicPostActions={props.onClickMagicPostActions}
				isFullscreen={isFullscreen}
			/>
			<EditorSubmitButtonContainer>
				<Button
					radius='lg'
					onClick={processDraftAndSubmit}
					disabled={draftEmpty}
				>
					Post
				</Button>
			</EditorSubmitButtonContainer>
		</InlineEditorWrapper>
	);
};
