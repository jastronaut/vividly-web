import Image from 'next/image';
import { ImageElement } from '../../../types/editor';

type ImageBlockProps = {
	url: string;
	width: number;
	height: number;
};

export const ImageBlock = (props: ImageBlockProps) => {
	const { url } = props;
	return (
		<Image src={url} alt={url} width={props.width} height={props.height} />
	);
};
