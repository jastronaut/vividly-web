import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Button } from '@mantine/core';
import { useMediaQuery, useWindowScroll } from '@mantine/hooks';

import {
	HEADER_SCROLL_HEIGHT,
	HEADER_SCROLL_HEIGHT_MOBILE,
} from '../header/constants';
import { UserResponse } from '@/types/api';
import { useCurUserContext } from '@/components/utils/CurUserContext';

const Wrapper = styled.div<{ scrolled: boolean }>`
	padding: ${rem(8)} ${rem(12)};
	display: flex;
	justify-content: center;
	transition: all 0.2s ease-in;
	opacity: 1;

	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	width: 100%;

	top: ${props => (props.scrolled ? rem(90) : rem(100))};

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
		// this should scroll to the undread post
		// but doesn't handle if the unread post is not on the current page
		const unread = document.getElementById(`${props.unreadPostId}`);
		if (unread) {
			unread.scrollIntoView({ behavior: 'smooth' });
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
			<Button variant='light' color='blue' size='md' onClick={onClick}>
				x unread posts
			</Button>
		</Wrapper>
	);
};

type Props = {
	user?: UserResponse | undefined;
};

export const UnreadBanner = (props: Props) => {
	const { curUser } = useCurUserContext();
	const { user } = props;

	if (!user || !curUser) {
		return null;
	}

	if (user.user.id === curUser.user.id) {
		return null;
	}

	if (!user.friendship || !user.friendship.lastReadPostId) {
		return null;
	}

	if (!user.friendship.newestPostId) {
		return null;
	}

	if (user.friendship.lastReadPostId >= user.friendship.newestPostId) {
		return null;
	}

	return <UnreadBannerButton unreadPostId={user.friendship.lastReadPostId} />;
};
