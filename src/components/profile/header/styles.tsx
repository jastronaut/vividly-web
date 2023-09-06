import { useState, useEffect } from 'react';
import {
	ActionIcon,
	Text,
	Skeleton,
	Tooltip,
	Collapse,
	Flex,
} from '@mantine/core';
import styled from 'styled-components';
import { rem } from 'polished';
import { IconStar, IconInfoCircle } from '@tabler/icons-react';
import { useWindowScroll, useMediaQuery } from '@mantine/hooks';

import { HEADER_SCROLL_HEIGHT, HEADER_SCROLL_HEIGHT_MOBILE } from './constants';
import { getRgba } from '@/components/utils/getRgba';
import { Linkified } from '@/components/common/Linkified';

type FavoriteButtonProps = {
	isFavorite: boolean;
	toggleFavorite: () => void;
};
export const FavoriteButton = (props: FavoriteButtonProps) => {
	const label = props.isFavorite ? 'Unfavorite friend' : 'Favorite friend';
	return (
		<ActionIcon
			onClick={props.toggleFavorite}
			color='yellow'
			variant={props.isFavorite ? 'light' : 'subtle'}
			aria-label={label}
		>
			<Tooltip withArrow label={label} position='bottom-end'>
				<IconStar size={16} />
			</Tooltip>
		</ActionIcon>
	);
};

export const InformationButton = (props: { toggleInformation: () => void }) => {
	const label = 'See user bio';
	return (
		<ActionIcon
			onClick={props.toggleInformation}
			color='blue'
			aria-label={label}
		>
			<Tooltip withArrow label={label} position='bottom-end'>
				<IconInfoCircle size={16} />
			</Tooltip>
		</ActionIcon>
	);
};

const BG_BLUR = `blur(${rem(6)})`;

export const ProfileHeaderContent = styled.div<{ scrolled: boolean }>`
	background-color: ${props => props.theme.background.primary};
	display: flex;
	padding: ${rem(10)} ${rem(36)};
	border-bottom: ${rem(1)} solid ${props => props.theme.background.secondary};
	border-top: none;

	transition: all 0.2s ease-in;

	position: sticky;
	top: 0;
	left: 0;
	z-index: 99;
	width: 100%;

	${props =>
		props.scrolled &&
		`background-color: ${getRgba(props.theme.background.primary, 0.9, false)};
		backdrop-filter: ${BG_BLUR};
		-webkit-backdrop-filter: ${BG_BLUR};
		-o-backdrop-filter: ${BG_BLUR};
		-moz-backdrop-filter: ${BG_BLUR};
	`}

	@media screen and (max-width: 800px) {
		padding: ${rem(10)} ${rem(18)} ${rem(6)};
		justify-content: center;
		align-items: center;
		border-left: none;
		border-right: none;
	}

	@media screen and (min-width: 801px) {
		top: ${rem(50)};
	}
`;

export const ProfileHeaderText = styled.div`
	flex: 1;
	margin: 0 ${rem(16)};

	a,
	a:visited {
		color: ${props => props.theme.link};
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	> h2 {
		margin: 0;
	}

	> p:last-child {
		margin: 0 auto;
		word-break: break-word;
	}

	@media screen and (max-width: 500px) {
		margin: 0 0 0 ${rem(8)};
	}
`;

const HeaderTextLoadingContainer = styled.div`
	min-width: ${rem(500)};
	padding-left: ${rem(16)};
`;

export const HeaderTextLoading = () => {
	return (
		<Flex>
			<Skeleton height={60} />
			<HeaderTextLoadingContainer>
				<Skeleton height={12} mt={6} width='40%' />
				<Skeleton height={12} mt={6} width='35%' />
			</HeaderTextLoadingContainer>
		</Flex>
	);
};

const NamesContainer = styled.div<{ height: number }>`
	display: flex;
	transition: height 0.3s ease-in;
	align-items: center;

	@media screen and (max-width: 800px) {
		flex-direction: column;
		margin-bottom: ${rem(4)};
		align-items: flex-start;
	}
`;

enum ScrollDirection {
	Up = 'UP',
	Down = 'DOWN',
}

type HeaderTextProps = {
	username: string;
	name?: string;
	bio: string;
	isLoading: boolean;
};

export const HeaderText = (props: HeaderTextProps) => {
	const [scroll] = useWindowScroll();

	const isMobile = useMediaQuery('(max-width: 800px)');

	const [lastScrollTop, setLastScrollTop] = useState<number>(0);
	const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(
		ScrollDirection.Up
	);

	let bioHidden = false;
	if (isMobile) {
		if (scroll.y > HEADER_SCROLL_HEIGHT_MOBILE && scrollDirection === 'DOWN') {
			bioHidden = true;
		}
	} else if (scroll.y > HEADER_SCROLL_HEIGHT) {
		bioHidden = true;
	}

	let namesHeight = 70;
	if (isMobile) {
		if (scroll.y > HEADER_SCROLL_HEIGHT_MOBILE) {
			namesHeight = 25;
		} else namesHeight = 50;
	} else if (scroll.y > HEADER_SCROLL_HEIGHT) {
		namesHeight = 50;
	}

	useEffect(() => {
		const handleScroll = () => {
			const st = window.pageYOffset || document.documentElement.scrollTop;
			if (st > lastScrollTop) {
				setScrollDirection(ScrollDirection.Down);
			} else {
				if (lastScrollTop - st >= 50) {
					setScrollDirection(ScrollDirection.Up);
				}
			}
			setLastScrollTop(st <= 0 ? 0 : st);
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [lastScrollTop]);

	const nameTextSize = isMobile ? 'md' : 'lg';
	const usernameTextSize = bioHidden && !isMobile ? 'md' : 'sm';

	if (props.isLoading || !props.username) {
		return <HeaderTextLoading />;
	}

	return (
		<>
			<ProfileHeaderText>
				<NamesContainer height={namesHeight}>
					<Text
						fw={700}
						sx={{
							marginRight: rem(4),
						}}
						fz={nameTextSize}
					>
						{props.name ?? props.username}
					</Text>
					<Text
						c='dimmed'
						id='username'
						fz={usernameTextSize}
						sx={{
							lineHeight: 0.9,
						}}
					>
						{` @`}
						{props.username}
					</Text>
				</NamesContainer>
				<Collapse in={!bioHidden}>
					{props.bio ? (
						<Text
							sx={{
								lineHeight: 1,
								wordBreak: 'break-word',
							}}
							fz={isMobile ? 'sm' : 'md'}
						>
							<Linkified>{props.bio}</Linkified>
						</Text>
					) : (
						<Text fs='italic'>No bio yet.</Text>
					)}
				</Collapse>
			</ProfileHeaderText>
		</>
	);
};

export const UserInfoSection = styled.div`
	display: flex;
	flex: 1;
	justify-content: start;
	@media screen and (max-width: 500px) {
		width: 100%;
	}
`;

export const FriendActionsMenuContainer = styled.div`
	position: absolute;
	top: ${rem(8)};
	right: ${rem(8)};

	@media screen and (max-width: 500px) {
		> div {
			gap: ${rem(8)};
		}
	}
`;

export const RightContent = styled.div`
	display: flex;
	align-self: flex-start;
`;
