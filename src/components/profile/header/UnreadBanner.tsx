import styled from 'styled-components';
import { rem } from 'polished';
import { Button } from '@mantine/core';
import { useMediaQuery, useWindowScroll } from '@mantine/hooks';
import { HEADER_SCROLL_HEIGHT, HEADER_SCROLL_HEIGHT_MOBILE } from './constants';

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

type Props = {
	visible: boolean;
	postId: number | string;
	onClick: () => void;
};

export const UnreadBanner = (props: Props) => {
	const [scroll] = useWindowScroll();
	const isMobile = useMediaQuery('(max-width: 800px)');

	const isScrolled = isMobile
		? scroll.y > HEADER_SCROLL_HEIGHT_MOBILE
		: scroll.y > HEADER_SCROLL_HEIGHT;

	const onclick = () => {
		// on click button, scroll to item on page with id of 'unread'
		const unread = document.getElementById(`${props.postId}`);
		if (unread) {
			unread.scrollIntoView({ behavior: 'smooth' });
			props.onClick();
		}
	};
	if (!props.visible) {
		return null;
	}

	return (
		<Wrapper scrolled={isScrolled}>
			<Button variant='light' color='blue' size='md' onClick={onclick}>
				x unread posts
			</Button>
		</Wrapper>
	);
};
