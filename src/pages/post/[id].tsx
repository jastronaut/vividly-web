import { useEffect } from 'react';
import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import { GetStaticPropsContext } from 'next';
import useSWR from 'swr';

import { Page } from '../_app';
import { PostResponse } from '@/types/api';
import { fetchWithToken } from '@/utils';
import { SinglePostView } from '@/components/post/SinglePostView';
import { PostProvider } from '@/components/post/PostContext';
import { URL_PREFIX } from '@/constants';
import AppLayout from '@/components/layout/AppLayout';

type PageProps = {
	id: string;
};

const PostPage: Page<PageProps> = (props: PageProps) => {
	const { curUser } = useCurUserContext();
	const { id } = props;

	const { token = null } = curUser;

	const { data, error, isLoading } = useSWR<PostResponse>(
		[id && token ? `${URL_PREFIX}/posts/${id}` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token)
	);

	useEffect(() => {
		if (error && !isLoading && !data) {
			window.location.href = '/404';
		}
	}, [error, isLoading, data]);

	return (
		<>
			{data?.post && !isLoading ? (
				<PostProvider post={data.post} curUser={curUser}>
					<SinglePostView />
				</PostProvider>
			) : (
				'lol'
			)}
		</>
	);
};

PostPage.getLayout = page => <AppLayout>{page}</AppLayout>;

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

export default PostPage;
