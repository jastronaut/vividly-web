import React, { useEffect } from 'react';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';

import { Page } from '../../_app';
import { useCurUserContext } from '@/components/contexts/CurUserContext';
import AppLayout from '@/components/layout/AppLayout';
import { Loading } from '@/components/common/Loading';
import { makeApiCall } from '@/utils';
import { UserInfoResponse } from '@/types/api';

type PageProps = {
	username: string;
};

const UsernameProfilePage: Page<PageProps> = props => {
	const { username } = props;
	const router = useRouter();
	const { curUser } = useCurUserContext();

	useEffect(() => {
		const getId = async () => {
			if (!curUser.token) {
				return;
			}

			if (username === curUser.user.username) {
				router.push(`/profile/${curUser.user.id}`);
			} else {
				const resp = await makeApiCall<UserInfoResponse>({
					uri: `/users/info/u/${username}`,
					token: curUser.token,
				});

				if (resp.error) {
					router.push('/404');
					return;
				}

				const { id } = resp.user;

				router.push(`/profile/${id}`);
			}
			window.history.replaceState(null, '', `/profile/u/${username}`);
		};

		getId();
	}, [username, curUser.token]);

	return <Loading />;
};

UsernameProfilePage.getLayout = page => <AppLayout>{page}</AppLayout>;

export const getStaticProps = (
	context: GetStaticPropsContext<{ username: string }>
) => {
	return {
		props: {
			username: context.params?.username,
		},
	};
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths = () => {
	return { paths: [], fallback: 'blocking' };
};

export default UsernameProfilePage;
