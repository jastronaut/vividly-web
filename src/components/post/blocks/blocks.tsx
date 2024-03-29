import Image from 'next/image';
import styled from 'styled-components';
import { rem } from 'polished';
import { useVividlyTheme, lightTheme, darkTheme } from '@/styles/Theme';

const StyledImage = styled(Image)`
	border-radius: ${rem(8)};
	height: auto;
	width: 60%;

	@media screen and (max-width: 800px) {
		border-radius: 0;
		width: 100%;
		height: auto;
	}
`;

type ImageBlockProps = {
	url: string;
	width: number;
	height: number;
	thumbnailUrl?: string;
};

export const ImageBlock = (props: ImageBlockProps) => {
	const { url } = props;
	const { theme } = useVividlyTheme();
	return (
		<StyledImage
			src={url}
			alt={url}
			width={props.width}
			height={props.height}
			placeholder='blur'
			blurDataURL={
				theme === 'light' ? lightTheme.blurDataURL : darkTheme.blurDataURL
			}
		/>
	);
};
