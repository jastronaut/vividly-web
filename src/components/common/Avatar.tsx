import styled from 'styled-components';
import { rem } from 'polished';
import Image from 'next/image';
import { useVividlyTheme, lightTheme, darkTheme } from '@/styles/Theme';

const DEFAULT_SIZE = 50;
const SMALLER_DEFAULT_SIZE = 50 * 0.75;

const AvatarRoot = styled.div<{ size?: number }>`
	box-sizing: border-box;
	position: relative;
	display: block;
	user-select: none;
	overflow: hidden;
	border-radius: 0.25rem;
	text-decoration: none;
	border: 0px none;
	background-color: transparent;
	padding: 0px;
	width: ${props => rem(props.size || DEFAULT_SIZE)};
	min-width: ${props => rem(props.size || DEFAULT_SIZE / 2)};
	height: ${props => rem(props.size || DEFAULT_SIZE)};
	transition: all 0.2s ease-in;

	@media screen and (max-width: 800px) {
		width: ${props =>
			rem(props.size ? props.size * 0.75 : SMALLER_DEFAULT_SIZE)};
		min-width: ${props =>
			rem(props.size ? props.size * 0.75 : SMALLER_DEFAULT_SIZE / 2)};
		height: ${props =>
			rem(props.size ? props.size * 0.75 : SMALLER_DEFAULT_SIZE)};
	}
`;

const AvatarImg = styled(Image)`
	object-fit: cover;
	width: 100%;
	height: 100%;
	display: block;
	border-radius: 50%;
`;

export const Avatar = ({
	size = 50,
	src,
	alt,
	onClick,
}: {
	size?: number;
	src: string;
	alt: string;
	onClick?: () => void;
}) => {
	const { theme } = useVividlyTheme();
	return (
		<AvatarRoot onClick={onClick} size={size}>
			<AvatarImg
				src={src}
				alt={alt}
				width={size}
				height={size}
				blurDataURL={
					theme === 'light' ? lightTheme.blurDataURL : darkTheme.blurDataURL
				}
			/>
		</AvatarRoot>
	);
};
