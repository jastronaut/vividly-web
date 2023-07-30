import { Avatar } from '@/components/common/Avatar';
import { DEFAULT_AVATAR } from '@/constants';
import { Skeleton } from '@mantine/core';
import { useWindowScroll, useMediaQuery } from '@mantine/hooks';
import styled from 'styled-components';

import { HEADER_SCROLL_HEIGHT, HEADER_SCROLL_HEIGHT_MOBILE } from './constants';

const StyledAvatar = styled(Avatar)`
	align-self: center;
`;

type Props = {
	avatarSrc?: string;
	username: string;
	isLoading: boolean;
};

export const HeaderAvatar = (props: Props) => {
	const [scroll] = useWindowScroll();
	const isMobile = useMediaQuery('(max-width: 800px)');
	let height = 80;
	if (isMobile) {
		if (scroll.y > HEADER_SCROLL_HEIGHT_MOBILE) {
			height = 50;
		} else height = 70;
	} else if (scroll.y > HEADER_SCROLL_HEIGHT) {
		height = 35;
	}

	if (props.isLoading || !props.username) {
		return <Skeleton height={height} circle />;
	}

	return (
		<StyledAvatar
			src={props.avatarSrc || DEFAULT_AVATAR}
			alt={`${props.username}'s avatar.`}
			size={height}
		/>
	);
};
