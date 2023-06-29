import { Avatar } from '@/components/Avatar';
import { DEFAULT_AVATAR } from '@/constants';
import { Skeleton } from '@mantine/core';
import { useWindowScroll, useMediaQuery } from '@mantine/hooks';

import { HEADER_SCROLL_HEIGHT, HEADER_SCROLL_HEIGHT_MOBILE } from './constants';

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
			height = 40;
		} else height = 60;
	} else if (scroll.y > HEADER_SCROLL_HEIGHT) {
		height = 40;
	}

	if (props.isLoading || !props.username) {
		return <Skeleton height={height} circle />;
	}

	return (
		<Avatar
			src={props.avatarSrc || DEFAULT_AVATAR}
			alt={`${props.username}'s avatar.`}
			size={height}
		/>
	);
};
