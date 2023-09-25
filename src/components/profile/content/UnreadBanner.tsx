import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Button } from '@mantine/core';
import { useMediaQuery, useWindowScroll } from '@mantine/hooks';

import {
	HEADER_SCROLL_HEIGHT,
	HEADER_SCROLL_HEIGHT_MOBILE,
} from '../header/constants';
import { Friend } from '@/types/user';

const Wrapper = styled.div<{ scrolled: boolean }>`
	padding: ${rem(8)} ${rem(12)};
	display: flex;
	justify-content: center;
	transition: all 0.2s ease-in;
	opacity: 1;
	position: fixed;
	left: 0;
	z-index: 100;
	width: 100%;
	top: ${props => (props.scrolled ? rem(100) : rem(110))};

	button {
		box-shadow: ${props => `0 0 ${rem(4)} ${props.theme.accent}`};
	}

	@media screen and (max-width: 800px) {
		top: ${props => (props.scrolled ? rem(50) : rem(70))};
	}
`;

type UnreadBannerProps = {
	unreadPostId: number;
};

const UnreadBannerButton = (props: UnreadBannerProps) => {
	const [scroll] = useWindowScroll();
	const isMobile = useMediaQuery('(max-width: 800px)');
	const [isShowing, setIsShowing] = useState(true);

	const isScrolled = isMobile
		? scroll.y > HEADER_SCROLL_HEIGHT_MOBILE
		: scroll.y > HEADER_SCROLL_HEIGHT;

	const onClick = () => {
		// this should scroll to the unread post
		// but doesn't handle if the unread post is not on the current page
		const unread = document.getElementById(`${props.unreadPostId}`);
		if (unread) {
			unread.scrollIntoView({ behavior: 'smooth' });
			setIsShowing(false);
			setIsShowing(false);
		}
	};

	useEffect(() => {
		return () => {
			setIsShowing(true);
		};
	}, []);

	if (!isShowing) {
		return null;
	}

	return (
		<Wrapper scrolled={isScrolled}>
			<Button size='md' onClick={onClick}>
				Jump to unread posts
			</Button>
		</Wrapper>
	);
};

type Props = {
	friend: Friend | undefined;
};

export const UnreadBanner = (props: Props) => {
	const { friend } = props;

	if (!friend) {
		return null;
	}

	if (!friend.lastReadPostId) {
		return null;
	}

	if (!friend.newestPostId) {
		return null;
	}

	if (friend.lastReadPostId >= friend.newestPostId) {
		return null;
	}

	return <UnreadBannerButton unreadPostId={friend.lastReadPostId} />;
};
