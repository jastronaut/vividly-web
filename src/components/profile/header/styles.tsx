import { ActionIcon, Text, Skeleton, Title, Tooltip } from '@mantine/core';
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
			<Tooltip withArrow label={label}>
				<IconStar size={16} />
			</Tooltip>
		</ActionIcon>
	);
};

export const ProfileHeaderContent = styled.div`
	background-color: ${props => props.theme.background.primary};
	display: flex;
	padding: ${rem(10)} ${rem(36)} ${rem(16)};
	border-bottom: ${rem(1)} solid ${props => props.theme.background.secondary};

	@media screen and (max-width: 500px) {
		padding-bottom: ${rem(16)};
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
`;

export const ProfileHeaderText = styled.div`
	flex: 9;
	margin: ${rem(16)};

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
		<Title order={2}>{props.name ?? props.username}</Title>
		<Text>{props.bio}</Text>
	</>
);
