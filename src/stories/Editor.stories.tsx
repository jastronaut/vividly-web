import { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from 'styled-components';

import { EditorWithActions } from '../components/editor/Editor';
import { VividlyThemeProvider } from '../styles/Theme';
import { EditorBlockType } from '@/types/editor';
import { withEmbeds } from '@/components/editor/utils';
import { InlineEditorWrapper } from '@/components/editor/styles';
import { LocalizationProvider } from '@/components/contexts/LocalizationContext';

const Wrapper = styled.div`
	width: 400px;
`;

export default {
	title: 'Editor',
	component: EditorWithActions,
} as ComponentMeta<typeof EditorWithActions>;

const Template: ComponentStory<typeof EditorWithActions> = args => {
	const [draft, setDraft] = useState(args.initialValue);
	const [editor] = useState(() =>
		withHistory(withReact(withEmbeds(createEditor())))
	);
	return (
		<VividlyThemeProvider>
			<LocalizationProvider>
				<Wrapper>
					<InlineEditorWrapper isFullscreen={false}>
						<EditorWithActions
							{...args}
							editor={editor}
							onChange={setDraft}
							onClickMagicPostActions={() => {}}
						/>
					</InlineEditorWrapper>
				</Wrapper>
			</LocalizationProvider>
		</VividlyThemeProvider>
	);
};

export const Primary = Template.bind({});

const emptyChildren = {
	children: [{ text: '' }],
};

Primary.args = {
	initialValue: [
		{
			type: EditorBlockType.TEXT,
			children: [{ text: 'A line of text in a paragraph.' }],
		},
		{
			type: EditorBlockType.IMAGE,
			url: 'https://i.ibb.co/YQz8PST/tumblr-1bc11f163eb6a3bca192be4504b6ff9e-a858f2b1-400.jpg',
			width: 414,
			height: 276,
			...emptyChildren,
		},
		{
			type: EditorBlockType.TEXT,
			children: [{ text: '2 A line of text in a paragraph.' }],
		},
		{
			type: EditorBlockType.IMAGE,
			url: 'https://i.ibb.co/P1XbY7D/1670228032635028.jpg',
			...emptyChildren,
			width: 621,
			height: 414,
		},
		{
			type: EditorBlockType.LINK,
			url: 'https://www.google.com',
			title: 'Google',
			description: 'Search engine',
			...emptyChildren,
		},
	],
};

export const Empty = Template.bind({});

Empty.args = {
	initialValue: [
		{
			type: EditorBlockType.TEXT,
			children: [{ text: '' }],
		},
	],
};

export const Link = Template.bind({});
Link.args = {
	initialValue: [
		{
			type: EditorBlockType.LINK,
			url: 'https://www.google.com',
			title: 'Google',
			description: 'Search engine',
			imageURL: 'https://i.ibb.co/7CTbH64/google.png',
			children: [{ text: '' }],
		},
	],
};

export const Youtube = Template.bind({});
Youtube.args = {
	initialValue: [
		{
			type: EditorBlockType.MUSIC,
			youtubeEmbedUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
			children: [{ text: '' }],
		},
	],
};

export const Spotify = Template.bind({});
Spotify.args = {
	initialValue: [
		{
			type: EditorBlockType.MUSIC,
			spotifyEmbedUrl:
				'https://open.spotify.com/embed/track/77iRifbhkJGvGBBRNykUwN?utm_source=generator',
			children: [{ text: '' }],
		},
	],
};

export const AppleMusic = Template.bind({});
AppleMusic.args = {
	initialValue: [
		{
			type: EditorBlockType.MUSIC,
			appleMusicEmbedUrl:
				'https://embed.music.apple.com/us/album/silver/1544377328?i=1544377598',
			children: [{ text: '' }],
		},
	],
};

export const Location = Template.bind({});
Location.args = {
	initialValue: [
		{
			type: EditorBlockType.LOCATION,
			name: 'Cava',
			locality: 'Ashburn',
			region: 'VA',
			icon: 'https://ss3.4sqi.net/img/categories_v2/food/mediterranean_bg_32.png',
			children: [{ text: '' }],
		},
	],
};
