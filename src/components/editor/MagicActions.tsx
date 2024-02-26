import { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import {
	Collapse,
	Flex,
	Button,
	TextInput,
	Space,
	ActionIcon,
	Center,
	Text,
} from '@mantine/core';
import {
	IconChevronLeft,
	IconChevronRight,
	IconCloud,
	IconLink,
	IconSearch,
	IconX,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { GiphyFetch, GifsResult } from '@giphy/js-fetch-api';
import { Carousel } from '@giphy/react-components';

import { LocationElement, MusicElement } from '@/types/editor';
import { EditorBlockType } from '@/types/editor';
import { FOURSQUARE_API_KEY } from '@/constants';
import { BlockType } from '@/types/post';
import { FoursquarePlace } from '@/types/api';

import { LocationBlock } from '../post/blocks/LocationBlock';
import { LocationSelectorContainer } from './styles';

import { MiniLoader } from '../common/Loading';

const spotifyRegex = /https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+/g;
const appleRegex =
	/https:\/\/music\.apple\.com\/[a-zA-Z0-9]+\/album\/[a-zA-Z0-9]+/g;
const youtubeRegex = /https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9]+/g;
const youtubeShortenedRegex = /https:\/\/youtu\.be\/[a-zA-Z0-9]+/g;
const youtubeStartTimeRegex = /\?t=/g;

type OracleInputProps = {
	isVisible: boolean;
	onClickAskOracle: (question: string) => void;
};

export const OracleInput = (props: OracleInputProps) => {
	const { isVisible, onClickAskOracle } = props;
	const [question, setQuestion] = useState('');

	const onSelect = () => {
		if (question.length < 1) return;
		onClickAskOracle(question);
		setQuestion('');
	};

	useEffect(() => {
		if (isVisible) {
			setQuestion('');
		}
	}, [isVisible]);

	return (
		<Collapse in={isVisible}>
			<>
				<Space h='md' />
				<Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
					<TextInput
						sx={{ flex: 1, paddingRight: '1rem' }}
						value={question}
						radius='md'
						onChange={e => setQuestion(e.currentTarget.value)}
						placeholder='Ask a yes or no question...'
						maxLength={200}
						icon={<IconCloud />}
					/>
					<Button
						variant='light'
						radius='lg'
						size='sm'
						onClick={onSelect}
						disabled={question.length < 1}
					>
						Ask
					</Button>
				</Flex>
				<Space h='xs' />
			</>
		</Collapse>
	);
};

type MusicInputProps = {
	isVisible: boolean;
	onSelect: (songData: MusicElement) => void;
};

export const MusicInput = (props: MusicInputProps) => {
	const { isVisible } = props;
	const [query, setQuery] = useState('');
	const [error, setError] = useState<string | null>(null);

	const onSelect = async () => {
		try {
			if (query.length < 1) {
				throw new Error('Invalid URL');
			}

			// make sure that pasted url is either spotify or apple music
			const spotifyMatch = query.match(spotifyRegex);
			const appleMatch = query.match(appleRegex);
			const youtubeMatch = query.match(youtubeRegex);
			const youtubeShortenedMatch = query.match(youtubeShortenedRegex);

			const musicData: MusicElement = {
				type: EditorBlockType.MUSIC,
				children: [{ text: query }],
			};

			if (appleMatch) {
				musicData.appleMusicEmbedUrl = `https://embed.music.apple.com/${
					query.split('https://music.apple.com/')[1]
				}`;
			} else if (spotifyMatch) {
				musicData.spotifyEmbedUrl = `https://open.spotify.com/embed/track/${
					query.split('https://open.spotify.com/track/')[1]
				}`;
			} else if (youtubeMatch || youtubeShortenedMatch) {
				const splitted = query.split(youtubeStartTimeRegex);
				musicData.youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/`;
				if (youtubeShortenedMatch) {
					const splittedShortUrl = splitted[0].split('https://youtu.be/')[1];
					if (!splitted[1]) musicData.youtubeEmbedUrl += `${splittedShortUrl}`;
					else
						musicData.youtubeEmbedUrl += `${splittedShortUrl}?start=${splitted[1]}`;
				} else {
					const splittedUrl = splitted[0].split(
						'https://www.youtube.com/watch?v='
					)[1];
					musicData.youtubeEmbedUrl += `${splittedUrl}`;
				}
			} else {
				throw new Error('Invalid URL');
			}
			props.onSelect(musicData);
			setQuery('');
		} catch (err) {
			console.log(err);
			setError('Invalid URL');
		}
	};

	useEffect(() => {
		if (isVisible) {
			setError(null);
			setQuery('');
		}
	}, [isVisible]);

	return (
		<Collapse in={isVisible}>
			<>
				<Space h='md' />
				<Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
					<TextInput
						sx={{ flex: 1, paddingRight: '1rem' }}
						value={query}
						radius='md'
						onChange={e => setQuery(e.currentTarget.value)}
						placeholder='Paste Spotify, Apple Music, or Youtube song link...'
						maxLength={200}
						icon={<IconLink />}
						error={error}
					/>
					<Button
						variant='light'
						radius='lg'
						size='sm'
						onClick={onSelect}
						disabled={query.length < 1}
					>
						Submit
					</Button>
				</Flex>
				<Space h='xs' />
			</>
		</Collapse>
	);
};

type LocationSelectorProps = {
	isVisible: boolean;
	onSelect: (location: LocationElement) => void;
};

export const LocationSelector = (props: LocationSelectorProps) => {
	const { isVisible, onSelect } = props;
	const [error, setError] = useState<string | null>(null);
	const [optionIndex, setOptionIndex] = useState(0);
	const [options, setOptions] = useState<FoursquarePlace[]>([]);

	useEffect(() => {
		if (isVisible) {
			setError(null);
			const positionSuccess = async (position: GeolocationPosition) => {
				const { longitude, latitude } = position.coords;

				try {
					const res = await fetch(
						`https://api.foursquare.com/v3/places/nearby?ll=${latitude},${longitude}&sort=DISTANCE&limit=15`,
						{
							method: 'GET',
							headers: {
								Authorization: `${FOURSQUARE_API_KEY}`,
								'Content-Type': 'application/json',
							},
						}
					);
					const data = await res.json();

					console.log(data);
					setOptions(
						data.results.filter(
							(result: FoursquarePlace) => result.categories.length > 0
						)
					);

					if (data.error) {
						throw Error(data.error);
					}
				} catch (err) {
					setError('Error fetching location');
				}
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
		}
	}, [isVisible]);

	if (isVisible && (!options || options.length < 1)) {
		return (
			<Center>
				<MiniLoader />
			</Center>
		);
	}

	const optionsLen = options.length;
	const selectedOption = options[optionIndex] || null;

	return (
		<Collapse in={isVisible}>
			<>
				<Space h='md' />
				{!selectedOption ? (
					<MiniLoader />
				) : (
					<LocationSelectorContainer>
						<ActionIcon
							variant={optionIndex === 0 ? 'light' : 'filled'}
							disabled={optionIndex === 0}
							title='Go back'
							radius='xl'
							size='sm'
							onClick={() => setOptionIndex(index => index - 1)}
						>
							<IconChevronLeft />
						</ActionIcon>

						<LocationBlock
							inSelector
							icon={`${selectedOption.categories[0].icon.prefix}bg_32${selectedOption.categories[0].icon.suffix}`}
							type={BlockType.LOCATION}
							name={selectedOption.name}
							locality={selectedOption.location.locality}
							region={selectedOption.location.region}
							onClick={() =>
								props.onSelect({
									type: EditorBlockType.LOCATION,
									icon: `${selectedOption.categories[0].icon.prefix}bg_32${selectedOption.categories[0].icon.suffix}`,
									name: selectedOption.name,
									locality: selectedOption.location.locality,
									region: selectedOption.location.region,
									children: [{ text: '' }],
								})
							}
						/>

						<ActionIcon
							variant={optionIndex === optionsLen - 1 ? 'light' : 'filled'}
							disabled={optionIndex === optionsLen - 1}
							title='Go back'
							radius='xl'
							size='sm'
							onClick={() => {
								if (optionIndex === optionsLen - 1) return;
								setOptionIndex(index => index + 1);
							}}
						>
							<IconChevronRight />
						</ActionIcon>
					</LocationSelectorContainer>
				)}
				<Space h='xs' />
			</>
		</Collapse>
	);
};

const giphyFetch = new GiphyFetch(process.env.GIPHY_API_KEY || '');

const EMPTY_GIF_RESULT: GifsResult = {
	data: [],
	pagination: {
		total_count: 0,
		count: 0,
		offset: 0,
	},
	meta: {
		msg: '',
		response_id: '',
		status: 200,
	},
};

const NoGIFResults = () => {
	return (
		<>
			<Space h='md' />
			<Text c='dimmed' ta='center'>
				We couldn&apos;t find anything.
				<br />
				Try searching for something else!
			</Text>
		</>
	);
};

type GIFSelectorProps = {
	isVisible: boolean;
	onSelect: (url: string, width: number, height: number) => void;
};

export const GIFSelector = (props: GIFSelectorProps) => {
	const [query, setQuery] = useState('');
	const [error, setError] = useState<string | null>(null);

	const onSelectGIF = (
		gif: GifsResult['data'][0],
		e: SyntheticEvent<HTMLElement, Event>
	) => {
		e.preventDefault();
		props.onSelect(
			gif.images.original.url,
			gif.images.original.width,
			gif.images.original.height
		);
	};

	const fetchGifs = useCallback(
		async (offset: number) => {
			if (props.isVisible && query.length > 0) {
				const res = await giphyFetch.search(query, { offset, limit: 10 });
				return res;
			}
			return await Promise.resolve(EMPTY_GIF_RESULT);
		},
		[query, props.isVisible]
	);

	useEffect(() => {
		return () => {
			setQuery('');
		};
	}, []);

	return (
		<>
			<Collapse in={props.isVisible}>
				<>
					<Space h='md' />
					<Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
						<TextInput
							sx={{ flex: 1, paddingRight: '1rem' }}
							value={query}
							radius='md'
							onChange={e => setQuery(e.currentTarget.value)}
							placeholder='Search for a GIF...'
							maxLength={100}
							icon={<IconSearch />}
						/>
					</Flex>
					<Space h='xs' />
					{query.length > 0 && (
						<Carousel
							key={query}
							fetchGifs={fetchGifs}
							gifHeight={200}
							gutter={6}
							onGifClick={onSelectGIF}
							noLink
							noResultsMessage={<NoGIFResults />}
						/>
					)}
					<Space h='xs' />
				</>
			</Collapse>
		</>
	);
};
