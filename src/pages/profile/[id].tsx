import React, { useEffect } from 'react';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';

import { Page } from '../_app';
import { useCurUserContext } from '@/components/contexts/CurUserContext';
import { FriendsProvider } from '@/components/contexts/FriendsContext';
import AppLayout from '@/components/layout/AppLayout';
import { UserProfileLoadingState } from '@/components/profile/UserProfileLoadingState';
import { ProfileProvider } from '@/components/contexts/ProfileFeedContext';
import Profile from '@/components/profile/Profile';

type PageProps = {
	id: string;
};

const ProfilePage: Page<PageProps> = props => {
	const { id } = props;
	const { curUser, isLoading } = useCurUserContext();
	const router = useRouter();

	// useEffect(() => {
	// 	if (!isLoading && !curUser.user) {
	// 		router.push('/login');
	// 	}
	// }, [curUser, isLoading]);

	if (isLoading || !curUser || !curUser.user) {
		return <UserProfileLoadingState />;
	}

	return (
		<FriendsProvider id={id}>
			<ProfileProvider profileId={id}>
				<Profile id={id} />
			</ProfileProvider>
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
