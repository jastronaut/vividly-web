import { ActionIcon, Text, Skeleton, Tooltip, Flex } from '@mantine/core';
import styled from 'styled-components';
import { rem } from 'polished';
import { IconStar } from '@tabler/icons-react';

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

export const ProfileHeaderContent = styled.div`
	background-color: ${props => props.theme.background.primary};
	display: flex;
	padding: ${rem(10)} ${rem(36)};
	border-bottom: ${rem(1)} solid ${props => props.theme.background.secondary};

	position: fixed;
	top: 0;
	left: 0;
	z-index: 99;
	width: 100%;
	max-height: ${rem(75)};

	@media screen and (max-width: 801px) {
		padding: ${rem(10)} ${rem(18)} ${rem(6)};
		justify-content: center;
		align-items: center;
	}

	@media screen and (min-width: 800px) {
		top: ${rem(50)};
	}

	@media screen and (min-width: 1000px) {
		padding-left: ${rem(200)};
		padding-right: ${rem(200)};
	}

	@media screen and (min-width: 1200px) {
		padding-left: ${rem(312)};
		padding-right: ${rem(312)};
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
		margin: ${rem(8)} 0 ${rem(8)} ${rem(8)};
	}
`;

export const HeaderTextLoading = () => {
	return (
		<>
			<Skeleton height={28} width='60%' />
			<Skeleton height={16} mt={6} width='20%' />
			<Skeleton height={16} mt={6} width='40%' />
		</>
	);
};

type HeaderTextProps = {
	username: string;
	name?: string;
	bio: string;
};

export const HeaderText = (props: HeaderTextProps) => (
	<>
		<Flex>
			<Text
				fw={700}
				sx={{
					marginRight: '0.25rem',
					lineHeight: '1',
				}}
			>
				{props.name ?? props.username}
			</Text>
			<Text
				c='dimmed'
				sx={{
					lineHeight: '1',
				}}
			>
				{` @`}
				{props.username}
			</Text>
		</Flex>
		<Text>{props.bio}</Text>
	</>
);

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
