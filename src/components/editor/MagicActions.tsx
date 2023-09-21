import { useState, useEffect } from 'react';
import {
	Collapse,
	Flex,
	Button,
	TextInput,
	Space,
	ActionIcon,
	Center,
} from '@mantine/core';
import {
	IconChevronLeft,
	IconChevronRight,
	IconCloud,
	IconLink,
	IconX,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

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

	const onSubmit = () => {
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
						onClick={onSubmit}
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
	onSubmit: (songData: MusicElement) => void;
};

export const MusicInput = (props: MusicInputProps) => {
	const { isVisible } = props;
	const [query, setQuery] = useState('');
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async () => {
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
			props.onSubmit(musicData);
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
						onClick={onSubmit}
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
	onSubmit: (location: LocationElement) => void;
};

export const LocationSelector = (props: LocationSelectorProps) => {
	const { isVisible, onSubmit } = props;
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
					setOptions(data.results);

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
								props.onSubmit({
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
							onClick={() => setOptionIndex(index => index + 1)}
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
