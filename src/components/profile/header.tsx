import { useState } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Skeleton, Avatar, Text, Flex, Button, Modal } from '@mantine/core';

import { DEFAULT_AVATAR } from '../../constants';
import { SettingsModal } from './SettingsModal';

export const ProfileHeaderContainer = styled.div`
	padding-top: ${rem(50)};
	border: 1px solid ${props => props.theme.border.secondary};
	color: ${props => props.theme.text.primary};
	background-size: cover;

	@media screen and (max-width: 700px) {
		margin: 0;
	}
`;

export const ProfileHeaderContent = styled.div`
	background-color: ${props => props.theme.background.primary};
	display: flex;
	padding: ${rem(10)} ${rem(15)} ${rem(16)};
	margin-top: ${rem(50)};
	border-top: ${rem(10)} solid ${props => props.theme.background.primary};
	border-top-left-radius: ${rem(20)};
	border-top-right-radius: ${rem(20)};

	@media screen and (max-width: 500px) {
		padding-bottom: ${rem(6)};
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: ${rem(24)};
		text-align: center;
	}
`;

export const ProfileHeaderText = styled.div`
	flex: 9;
	margin: 1rem;

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

type ProfileHeaderProps = {
	isLoading: boolean;
	bio?: string;
	username?: string;
	name?: string;
	avatarSrc?: string;
};

export const ProfileHeaderComponent = (props: ProfileHeaderProps) => {
	const { isLoading, bio, name, username, avatarSrc } = props;
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
	return (
		<ProfileHeaderContainer>
			<SettingsModal
				isOpen={isSettingsModalOpen}
				onClose={() => setIsSettingsModalOpen(false)}
			/>
			<ProfileHeaderContent>
				{isLoading ? (
					<Skeleton height={100} circle mb='xl' />
				) : (
					<Avatar src={avatarSrc ?? DEFAULT_AVATAR} radius={50} size={100} />
				)}
				<ProfileHeaderText>
					{isLoading && <Skeleton height={28} width='60%' />}
					{!isLoading && <h2>{name ?? username}</h2>}

					{isLoading && <Skeleton height={16} mt={6} width='20%' />}

					{isLoading && <Skeleton height={16} mt={6} width='40%' />}
					{!isLoading && <Text>{bio || 'No bio yet.'}</Text>}
				</ProfileHeaderText>
				<>
					<Flex>
						<>
							<Button
								variant='outline'
								size='sm'
								color='grape'
								radius='xl'
								onClick={() => setIsSettingsModalOpen(true)}
							>
								Edit profile
							</Button>
						</>
					</Flex>
				</>
			</ProfileHeaderContent>
		</ProfileHeaderContainer>
	);
};

export const ProfileHeader = () => {
	const [isLoading, setIsLoading] = useState(true);
	return <ProfileHeaderComponent isLoading={isLoading} />;
};
