import { ActionIcon, Text, Skeleton, Tooltip, Collapse } from '@mantine/core';
import styled from 'styled-components';
import { rem } from 'polished';
import { IconStar, IconInfoCircle } from '@tabler/icons-react';
import { useWindowScroll, useMediaQuery } from '@mantine/hooks';
import { HEADER_SCROLL_HEIGHT, HEADER_SCROLL_HEIGHT_MOBILE } from './constants';
import { getRgba } from '@/components/layout/NavigationLayout';

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
			variant={props.isFavorite ? 'filled' : 'outline'}
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
	border: ${rem(1)} solid ${props => props.theme.background.secondary};
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
	}

	@media screen and (min-width: 801px) {
		top: ${rem(50)};
	}
`;

export const ProfileHeaderText = styled.div`
	flex: 9;
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
		margin: 0 0 ${rem(8)} ${rem(8)};
	}
`;

export const HeaderTextLoading = () => {
	return (
		<>
			<Skeleton height={16} width='60%' />
			<Skeleton height={12} mt={6} width='40%' />
			<Skeleton height={12} mt={6} width='35%' />
		</>
	);
};

const NamesContainer = styled.div<{ height: number }>`
	display: flex;
	transition: height 0.3s ease-in;

	.mantine-Text-root {
		line-height: 1;
	}

	@media screen and (max-width: 800px) {
		flex-direction: column;
	}
`;

type HeaderTextProps = {
	username: string;
	name?: string;
	bio: string;
	bioExpanded: boolean;
	isLoading: boolean;
};

export const HeaderText = (props: HeaderTextProps) => {
	const [scroll] = useWindowScroll();

	const isMobile = useMediaQuery('(max-width: 800px)');

	let bioHidden = false;
	if (isMobile) {
		if (scroll.y > HEADER_SCROLL_HEIGHT_MOBILE) {
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

	if (props.isLoading || !props.username) {
		return <HeaderTextLoading />;
	}

	return (
		<>
			<NamesContainer height={namesHeight}>
				<Text
					fw={700}
					sx={{
						marginRight: rem(4),
					}}
					fz={bioHidden ? 'lg' : 'md'}
				>
					{props.name ?? props.username}
				</Text>
				<Text c='dimmed' id='username'>
					{` @`}
					{props.username}
				</Text>
			</NamesContainer>
			<Collapse in={!bioHidden}>
				{props.bio ? (
					<Text>{props.bio}</Text>
				) : (
					<Text fs='italic'>No bio yet.</Text>
				)}
			</Collapse>
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
