import { useState, useEffect } from 'react';
import { Collapse, Flex, Button, TextInput, Space, Text } from '@mantine/core';
import { IconCloud, IconLink } from '@tabler/icons-react';

import { MusicElement } from '@/types/editor';
import { EditorBlockType } from '@/types/editor';

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
