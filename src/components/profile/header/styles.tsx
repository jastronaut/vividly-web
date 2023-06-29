import { ActionIcon, Text, Skeleton, Tooltip, Collapse } from '@mantine/core';
import styled from 'styled-components';
import { rem } from 'polished';
import { IconStar, IconInfoCircle } from '@tabler/icons-react';

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
			variant='filled'
		>
			<Tooltip withArrow label={label} position='bottom-end'>
				<IconInfoCircle size={16} />
			</Tooltip>
		</ActionIcon>
	);
};

export const ProfileHeaderContent = styled.div<{ expanded?: boolean }>`
	background-color: ${props => props.theme.background.primary};
	display: flex;
	padding: ${rem(10)} ${rem(36)};
	border: ${rem(1)} solid ${props => props.theme.background.secondary};
	border-top: none;

	transition: all 0.2s ease-in-out;

	position: sticky;
	top: 0;
	left: 0;
	z-index: 99;
	width: 100%;

	@media screen and (max-width: 800px) {
		padding: ${rem(10)} ${rem(18)} ${rem(6)};
		justify-content: center;
		align-items: center;
	}

	@media screen and (min-width: 801px) {
		top: ${rem(50)};
	}

	/* @media screen and (min-width: 1000px) {
		padding-left: ${rem(200)};
		padding-right: ${rem(200)};
	} */

	/* @media screen and (min-width: 1200px) {
		padding-left: ${rem(312)};
		padding-right: ${rem(312)};
	} */
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
			<Skeleton height={28} width='60%' />
			<Skeleton height={16} mt={6} width='20%' />
			<Skeleton height={16} mt={6} width='40%' />
		</>
	);
};

const NamesContainer = styled.div`
	display: flex;

	.mantine-Text-root {
		line-height: 1;
	}

	@media screen and (max-width: 800px) {
		flex-direction: column;

		#username {
			font-size: ${rem(12)};
		}
	}
`;

type HeaderTextProps = {
	username: string;
	name?: string;
	bio: string;
	bioExpanded: boolean;
};

export const HeaderText = (props: HeaderTextProps) => (
	<>
		<NamesContainer>
			<Text
				fw={700}
				sx={{
					marginRight: '0.25rem',
				}}
			>
				{props.name ?? props.username}
			</Text>
			<Text c='dimmed' id='username'>
				{` @`}
				{props.username}
			</Text>
		</NamesContainer>
		<Collapse in={props.bioExpanded}>
			{props.bio ? (
				<Text fz='sm'>{props.bio}</Text>
			) : (
				<Text fz='sm' fs='italic'>
					No bio yet.
				</Text>
			)}
		</Collapse>
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

export const RightContent = styled.div`
	display: flex;
	align-self: flex-start;
`;
