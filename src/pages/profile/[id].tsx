import { GetStaticPropsContext } from 'next';
import useSWR from 'swr';

import { ProfileProvider } from '../../components/profile/ProfileContext';
import { Page } from '../_app';
import { User } from '../../types/user';
import { fetchWithToken } from '../../utils';

import { ProfileHeaderComponent } from '../../components/header';

type PostsProps = {
	userId: string;
};

const ProfilePosts = (props: PostsProps) => {
	const { userId } = props;

	const { data, error, isLoading } = useSWR<Post[]>(`http://localhost:1337/v0/feed/uid/${userId}`);
	return (
		<div>
			<h1>Posts</h1>
			{userId}
		</div>
	);
};

type PageProps = {
	id: string;
};

const Profile: Page<PageProps> = props => {
	const { id } = props;
	const { data, error, isLoading } = useSWR<User>(
		`http://localhost:1337/v0/users/${id}`
	);
	return (
		<div>
			<ProfileHeaderComponent isLoading={isLoading} {...data} />
			<ProfilePosts userId={data?.id} />
		</div>
	);
};

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

export default Profile;
