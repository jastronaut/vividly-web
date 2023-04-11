import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import { GetStaticPropsContext } from 'next';
import useSWR from 'swr';
import { Page } from '../_app';
import AppShellLayout from '@/components/layout/AppShellLayout';
import { PostResponse } from '@/types/api';
import { fetchWithToken } from '@/utils';
import { SinglePostView } from '@/components/post/SinglePostView';

type PageProps = {
	id: string;
};

const PostPage: Page<PageProps> = (props: PageProps) => {
	const { curUser } = useCurUserContext();
	const { id } = props;

	const { token = null } = curUser;

	const { data, error, isLoading, mutate } = useSWR<PostResponse>(
		[id && token ? `http://localhost:1337/v0/posts/${id}` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token)
	);

	return (
		<AppShellLayout id={curUser?.user?.id}>
			{data?.post && !isLoading ? (
				<SinglePostView post={data.post} curUser={curUser} />
			) : (
				'lol'
			)}
		</AppShellLayout>
	);
};

PostPage.getLayout = page => <CurUserProvider>{page}</CurUserProvider>;

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
