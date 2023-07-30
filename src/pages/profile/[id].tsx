import React from 'react';
import { GetStaticPropsContext } from 'next';

import { Page } from '../_app';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { FriendsProvider } from '@/components/utils/FriendsContext';
import AppLayout from '@/components/layout/AppLayout';
import { UserProfileLoadingState } from '@/components/profile/UserProfileLoadingState';
import { ProfileProvider } from '@/components/utils/ProfileFeedContext';
import Profile from '@/components/profile/ProfilePage';

type PageProps = {
	id: string;
};

const ProfilePage: Page<PageProps> = props => {
	const { id } = props;
	const { curUser, isLoading } = useCurUserContext();

	return (
		<FriendsProvider id={id}>
			<>
				{!curUser.token || isLoading ? (
					<UserProfileLoadingState />
				) : (
					<ProfileProvider profileId={id}>
						<Profile id={id} />
					</ProfileProvider>
				)}
			</>
		</FriendsProvider>
	);
};

ProfilePage.getLayout = page => <AppLayout>{page}</AppLayout>;

export const getStaticProps = (
	context: GetStaticPropsContext<{ id: string }>
) => {
	return {
		props: {
			id: context.params?.id,
		},
	};
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths = () => {
	return { paths: [], fallback: 'blocking' };
};

export default ProfilePage;
