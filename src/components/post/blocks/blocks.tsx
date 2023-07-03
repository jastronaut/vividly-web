import Image from 'next/image';
import styled from 'styled-components';
import { rem } from 'polished';
import { DEFAULT_AVATAR } from '@/constants';

const StyledImage = styled(Image)`
	border-radius: ${rem(8)};
	max-width: 70%;
	height: auto;
	@media screen and (max-width: 500px) {
		border-radius: 0;
		width: 100%;
		height: auto;
	}
`;

type ImageBlockProps = {
	url: string;
	width: number;
	height: number;
};

export const ImageBlock = (props: ImageBlockProps) => {
	const { url } = props;
	return (
		<StyledImage
			src={url}
			alt={url}
			width={props.width}
			height={props.height}
			blurDataURL={DEFAULT_AVATAR}
			placeholder='blur'
		/>
	);
};
