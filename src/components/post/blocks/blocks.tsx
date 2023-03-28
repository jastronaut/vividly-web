import { Image } from '@mantine/core';
import { ImageElement } from '../../../types/editor';

type ImageBlockProps = {
	url: string;
	width: number;
	height: number;
};

export const ImageBlock = (props: ImageBlockProps) => {
	const { url, width, height } = props;
	return <Image src={url} width={width} height={height} alt={url} />;
};
