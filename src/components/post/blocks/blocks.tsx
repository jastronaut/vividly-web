import { Image } from '@mantine/core';
import { ImageElement } from '../../../types/editor';

type ImageBlockProps = {
	url: string;
	width: number;
	height: number;
};

export const ImageBlock = (props: ImageBlockProps) => {
	const { url } = props;
	return <Image sx={{ maxWidth: '90%' }} src={url} alt={url} />;
};
