import { Image } from '@mantine/core';
import { ImageElement } from '../../../types/editor';

export const ImageBlockContent = (props: ImageElement) => {
	const { url, width, height } = props;
	return <Image src={url} width={width} height={height} alt={url} />;
};
