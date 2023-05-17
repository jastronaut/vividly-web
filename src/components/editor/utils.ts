import { Weather } from '@/types/editor';
import { Element, Editor as SlateEditorType } from 'slate';
import { ReactEditor } from 'slate-react';
import dayjs from 'dayjs';

import { Transforms } from 'slate';

import { BlockType as EditorBlockType } from '../../types/editor';
import { ImgBBUploadResponse } from '@/types/api';

const IBB_KEY =
	process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

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

export const addTime = (editor: ReactEditor) => {
	const now = dayjs().format('h:mm A');
	const formattedTime = `🕓 ${now}`;
	removeBlankBlock(editor);
	Transforms.insertNodes(editor, {
		type: EditorBlockType.MAGIC,
		data: formattedTime,
		children: [{ text: formattedTime }],
	});
	finishAddingBlock(editor);
};

export const addDate = (editor: ReactEditor) => {
	const now = dayjs().format('dddd, MMMM D, YYYY');
	const formattedDate = `📰 ${now}`;
	const node: Element = {
		type: EditorBlockType.MAGIC,
		data: formattedDate,
		children: [{ text: formattedDate }],
	};
	// finishAddingBlock();

	removeBlankBlock(editor);

	Transforms.insertNodes(editor, node);

	finishAddingBlock(editor);
};

export const addLink = (editor: ReactEditor, url: string) => {
	removeBlankBlock(editor);

	editor.insertNode({
		type: EditorBlockType.LINK,
		url,
		children: [{ text: url }],
	});

	finishAddingBlock(editor);
};

export const addImage = (editor: ReactEditor, file: File | null) => {
	if (!file) {
		return;
	}

	const formData = new FormData();
	formData.append('image', file);

	fetch(`https://api.imgbb.com/1/upload?key=${IBB_KEY}`, {
		method: 'POST',
		body: formData,
	})
		.then(response => response.json())
		.then((result: ImgBBUploadResponse) => {
			const { url, width, height } = result.data;

			const img: Element = {
				type: EditorBlockType.IMAGE,
				url,
				width,
				height,
				children: [{ text: '' }],
			};
			removeBlankBlock(editor);
			Transforms.insertNodes(editor, img);
			finishAddingBlock(editor);
		})
		.catch(error => {
			console.error('Error:', error);
		});
};
