import { Weather } from '@/types/editor';
import { Element, Editor as SlateEditorType } from 'slate';
import { ReactEditor } from 'slate-react';
import dayjs from 'dayjs';
import { Descendant, Transforms } from 'slate';

import { EditorBlockType } from '../../types/editor';
import { ImgBBUploadResponse } from '@/types/api';
import { Block, QuoteBlock, BlockType } from '@/types/post';
import { IMGBB_API_KEY } from '@/types/constants';

export const withEmbeds = (props: SlateEditorType) => {
	const editor = props;
	const { isVoid } = editor;
	editor.isVoid = element =>
		element.type === EditorBlockType.IMAGE ||
		element.type === EditorBlockType.LINK ||
		element.type === EditorBlockType.MAGIC ||
		element.type === EditorBlockType.ORACLE ||
		element.type === EditorBlockType.QUOTE ||
		element.type === EditorBlockType.LOCATION
			? true
			: isVoid(element);
	return editor;
};

export function getWeatherEmoji(weather: Weather, time: number) {
	const id = weather.id;
	const night = time < 3 || time > 17;

	if (id < 300) {
		return `⛈`;
	} else if (id < 400) {
		return `🌧`;
	} else if (id < 511) {
		return `🌧`;
	} else if (id < 520) {
		return `❄️`;
	} else if (id < 600) {
		return '🌧';
	} else if (id < 700) {
		return `❄️`;
	} else if (id < 800) {
		return `🌫`;
	} else if (id === 800) {
		if (night) {
			return `🌙`;
		}
		return `☀️`;
	} else if (id === 801) {
		if (night) {
			return `☁️`;
		}
		return `🌤`;
	} else if (id === 802) {
		return `☁️`;
	} else if (id > 802) {
		if (night) {
			return `☁️`;
		}
		return `⛅️`;
	}

	return `🌡️`;
}

export function kelvinToFahrenheit(tempK: number) {
	return Math.floor(((tempK - 273.15) * 9) / 5 + 32);
}

export function kelvinToCelcius(tempK: number) {
	return Math.floor(tempK - 273.15);
}

export const finishAddingBlock = (editor: ReactEditor) => {
	Transforms.insertNodes(editor, {
		type: EditorBlockType.TEXT,
		children: [{ text: '' }],
	});

	ReactEditor.focus(editor);
};

export const removeBlankBlock = (editor: ReactEditor) => {
	const [firstNode] = SlateEditorType.node(editor, [0]);
	if (
		// @ts-ignore
		firstNode.type === EditorBlockType.TEXT &&
		// @ts-ignore
		firstNode.children.length === 1 &&
		// @ts-ignore
		firstNode.children[0].text === ''
	) {
		// Remove the initial empty paragraph
		Transforms.removeNodes(editor, { at: [0] });
	}
};

export const addTime = (editor: ReactEditor, use24HourTime: boolean) => {
	const now = dayjs();
	const convertedDate = use24HourTime
		? dayjs().format('H:mm')
		: now.format('h:mm A');
	const formattedTime = `🕓 ${convertedDate}`;
	removeBlankBlock(editor);
	Transforms.insertNodes(editor, {
		type: EditorBlockType.MAGIC,
		data: formattedTime,
		children: [{ text: formattedTime }],
	});
	finishAddingBlock(editor);
};

export const addDate = (editor: ReactEditor, dateFormat?: string) => {
	const now = dayjs().format(dateFormat || 'dddd, MMMM D, YYYY');
	const formattedDate = `📰 ${now}`;
	const node: Element = {
		type: EditorBlockType.MAGIC,
		data: formattedDate,
		children: [{ text: formattedDate }],
	};

	removeBlankBlock(editor);
	Transforms.insertNodes(editor, node);
	finishAddingBlock(editor);
};

export const addLink = async (editor: ReactEditor, url: string) => {
	removeBlankBlock(editor);

	const getMetadata = async () => {
		const sanitizedUrl = url.replace(/(^\w+:|^)\/\//, '');
		try {
			const response = await fetch(`/api/proxy/${sanitizedUrl}`);
			const html = await response.text();
			const doc = new DOMParser().parseFromString(html, 'text/html');

			const title =
				// @ts-ignore
				doc.querySelector('meta[name="title"]')?.content ||
				doc.querySelector('title')?.textContent ||
				'';
			const description =
				doc
					.querySelector('meta[name="description"]')
					?.getAttribute('content') || '';
			const image =
				doc
					.querySelector('meta[property="og:image"]')
					?.getAttribute('content') || '';

			return { title, description, image };
		} catch (e) {
			console.error(e);
			return { title: '', description: '', image: '' };
		}
	};

	const { description, title, image } = await getMetadata();

	editor.insertNode({
		type: EditorBlockType.TEXT,
		children: [{ text: url }],
	});

	editor.insertNode({
		type: EditorBlockType.LINK,
		url,
		description: description,
		title: title,
		imageURL: image,
		children: [{ text: '' }],
	});

	finishAddingBlock(editor);
};

export const addImage = (editor: ReactEditor, file: File | null) => {
	if (!file) {
		return;
	}

	const formData = new FormData();
	formData.append('image', file);

	fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
		method: 'POST',
		body: formData,
	})
		.then(response => response.json())
		.then((result: ImgBBUploadResponse) => {
			const { url, width, height, thumb } = result.data;

			const img: Element = {
				type: EditorBlockType.IMAGE,
				url,
				width,
				height,
				children: [{ text: '' }],
				thumbnailURL: thumb.url,
			};
			removeBlankBlock(editor);
			Transforms.insertNodes(editor, img);
			finishAddingBlock(editor);
		})
		.catch(error => {
			console.error('Error:', error);
		});
};

export const addOracleResponsePreview = (
	editor: ReactEditor,
	question: string
) => {
	removeBlankBlock(editor);

	const node: Element = {
		type: EditorBlockType.ORACLE,
		question,
		children: [{ text: 'Post to see the answer...' }],
	};

	Transforms.insertNodes(editor, node);
	finishAddingBlock(editor);
};

export const addQuote = (editor: ReactEditor, quote: QuoteBlock) => {
	removeBlankBlock(editor);
	Transforms.insertNodes(editor, {
		type: EditorBlockType.QUOTE,
		postId: quote.postId,
		preview: quote.preview,
		children: [{ text: '' }],
	});
	finishAddingBlock(editor);
};

const ORACLE_RESPONSES = [
	'Seriously doubt it.',
	'Yeah, right. Keep dreaming.',
	'Figure it out yourself.',
	'Obviously, why are you even asking?',
	"I've got better things to do than answer that.",
	'Absolutely not, darling.',
	'Not in a million years.',
	'Maybe when pigs fly.',
	'Not a chance, sweetie.',
	"I wouldn't hold my breath if I were you.",
	'Obviously!',
	'Absolutely, duh!',
	'All signs point to yes!',
	"It's a resounding yes, but don't push your luck.",
	'Without a doubt, but you already knew that.',
	"Absolutely, and don't act so surprised.",
	'Yes, but you already knew that.',
	"Well, look who's lucky— it's a resounding yes!",
	"Absolutely, and don't act surprised.",
	'You better believe it, honey!',
	"Of course, because you've got the magic touch!",
	'In your dreams? Nope, in your reality!',
	"Yes, and it's about time something went your way!",
	'Fate has its secrets.',
	'The universe works in mysterious ways.',
	"Sorry, that's classified information.",
	"You're not ready for that knowledge, trust me.",
	"Can't reveal it all, sweetie.",
	"Ask again when you're ready for a wild ride.",
	'I asked ChatGPT and it said no.',
];

export const generateOracleResponse = () => {
	return ORACLE_RESPONSES[Math.floor(Math.random() * ORACLE_RESPONSES.length)];
};

export const isDraftEmpty = (draft: Element[]) => {
	return (
		draft.length === 0 ||
		(draft.length === 1 &&
			draft[0].type === EditorBlockType.TEXT &&
			draft[0].children.length === 1 &&
			draft[0].children[0].text === '')
	);
};

export const stripBlocks = (blocks: Block[]) => {
	// remove all empty blocks at the end of the post

	const blocksCopy = [...blocks];
	let index = blocks.length - 1;

	while (index >= 0) {
		const block = blocksCopy[index];
		if (!block || (block.type === BlockType.TEXT && block.text === '')) {
			blocks.pop();
			index--;
		} else {
			break;
		}
	}

	return blocks;
};

export function postBlockToDescendant(block: Block): Descendant {
	switch (block.type) {
		case BlockType.TEXT:
			return {
				type: EditorBlockType.TEXT,
				children: [{ text: block.text }],
			};
		case BlockType.IMAGE:
			return {
				type: EditorBlockType.IMAGE,
				url: block.url,
				width: block.width,
				height: block.height,
				children: [{ text: '' }],
			};
		case BlockType.LINK:
			return {
				type: EditorBlockType.LINK,
				url: block.url,
				children: [{ text: '' }],
			};
		case BlockType.MUSIC:
			return {
				type: EditorBlockType.MUSIC,
				spotifyEmbedUrl: block.spotifyEmbedUrl,
				appleMusicEmbedUrl: block.appleMusicEmbedUrl,
				youtubeEmbedUrl: block.youtubeEmbedUrl,
				children: [{ text: '' }],
			};
		case BlockType.QUOTE:
			return {
				type: EditorBlockType.QUOTE,
				postId: block.postId,
				preview: block.preview,
				children: [{ text: '' }],
			};
		case BlockType.LOCATION:
			return {
				type: EditorBlockType.LOCATION,
				locality: block.locality,
				region: block.region,
				name: block.name,
				icon: block.icon,
				children: [{ text: '' }],
			};
		default:
			return {
				type: EditorBlockType.TEXT,
				children: [{ text: '' }],
			};
	}
}
