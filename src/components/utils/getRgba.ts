import { parseToRgb, rgba, darken } from 'polished';

export const getRgba = (
	color: string,
	opacity: number,
	isDarkened: boolean
) => {
	const rgb = parseToRgb(isDarkened ? darken(0.1, color) : color);
	return `${rgba(rgb.red, rgb.green, rgb.blue, opacity)}`;
};
