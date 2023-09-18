import { Center, Text } from '@mantine/core';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { FeedFriendship } from '@/types/feed';
import { User } from '@/types/user';
import { rem } from 'polished';

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	div > a {
		color: ${props => props.theme.accent};
	}

	@media screen and (min-width: 801px) {
		margin: ${rem(20)};
	}
`;

type Props = {
	nextFriendship: FeedFriendship;
	isLoading: boolean;
	user: User | undefined;
	isLoggedInUser: boolean;
};

export const NextUserBanner = (props: Props) => {
	const { nextFriendship, isLoading, user, isLoggedInUser } = props;
	const router = useRouter();

	const showNextFeedName =
		!isLoggedInUser &&
		!isLoading &&
		nextFriendship &&
		user &&
		nextFriendship.friend.id !== user.id &&
		nextFriendship.isUnread;

	const profileLink = `/profile/${nextFriendship?.friend.id}`;

	const onClick = () => {
		console.log('here');
		router.push(profileLink);
	};

	if (!showNextFeedName || !nextFriendship) return null;

	return (
		<Container>
			<Text c='dimmed' onClick={onClick}>
				Next up: <Link href={profileLink}>{nextFriendship.friend.name}</Link>
			</Text>
		</Container>
	);
};
