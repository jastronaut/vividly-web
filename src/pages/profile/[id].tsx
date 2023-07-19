import React, { useState, useEffect, useRef } from 'react';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';

import { Page } from '../_app';
import { showAndLogErrorNotification } from '@/showerror';
import { uri } from '@/constants';
import { Block } from '@/types/post';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import {
	FriendsProvider,
	useFriendsContext,
} from '@/components/utils/FriendsContext';

import { ProfileContent } from '@/components/profile/content/ProfileContent';
import { Editor } from '../../components/editor/Editor';
import AppLayout from '@/components/layout/AppLayout';
import { FadeIn } from '@/styles/Animations';
import { UserProfileLoadingState } from '@/components/profile/UserProfileLoadingState';
import {
	ProfileProvider,
	useProfileContext,
} from '@/components/utils/ProfileFeedContext';

type PageProps = {
	id: string;
};

const Profile = (props: PageProps) => {
	const { id } = props;
	const { curUser, updateCurUser } = useCurUserContext();
	const { token } = curUser;
	const router = useRouter();

	const {
		feed,
		loadMore,
		hasMore,
		user,
		userError,
		mutatePosts,
		isUserLoading,
		isPostsLoading,
		deletePost,
		addPostFromBlocks,
		updateUser,
		refetchFeed,
	} = useProfileContext();

	const { friends, refetchFriends } = useFriendsContext();

	const [initLoad, setInitLoad] = useState(true);
	const chatEndRef = useRef<HTMLDivElement>(null);

	// map friends response to array of objects containing a friend's name and username
	const friendsNamesList = friends
		? friends.map(friend => ({
				name: friend.friend.name,
				username: friend.friend.username,
		  }))
		: [];

	const onSubmitPost = async (blocks: Block[]) => {
		setInitLoad(false);
		addPostFromBlocks(blocks);
		setInitLoad(true);
	};

	const onDeletePost = (postId: number, pageIndex: number) => {
		try {
			deletePost(postId, pageIndex);
		} catch (err) {
			showAndLogErrorNotification('Could not delete post', err);
		}
	};

	useEffect(() => {
		if (user?.user.id === curUser.user.id) {
			updateCurUser(user.user);
		}

		// mark feed as read
		if (!user?.friendship || curUser.user.id === user.user.id) {
			return;
		}

		const { lastReadPostId, newestPostId } = user.friendship;
		if (lastReadPostId !== newestPostId) {
			fetch(`${uri}/feed/uid/${user.user.id}/read`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
				.then(res => res.json())
				.catch(err => {
					console.log({ err });
				});
		}
	}, [user]);

	useEffect(() => {
		if (userError && !isUserLoading && !user) {
			router.push('/404');
		}

		if (userError) {
			console.log({ userError });
			showAndLogErrorNotification('Error fetching user', userError);
		}
	}, [userError]);

	useEffect(() => {
		refetchFriends();
		if (chatEndRef.current) {
			setInitLoad(true);
			chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
		return () => {
			setInitLoad(true);
		};
	}, [id]);

	useEffect(() => {
		mutatePosts(undefined, true);
		// fetchFriends(true);
		refetchFriends();
		return () => {
			setInitLoad(true);
		};
	}, []);

	useEffect(() => {
		if (
			feed &&
			initLoad &&
			chatEndRef.current &&
			!isPostsLoading &&
			!isUserLoading
		) {
			chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
			console.log(chatEndRef.current);
			console.log('called');
			setInitLoad(false);
		}
	}, [feed, initLoad, isPostsLoading, isUserLoading, chatEndRef.current]);

	const isEditorVisible =
		user &&
		user.user.id === curUser.user.id &&
		!isPostsLoading &&
		!isUserLoading;

	return (
		<FadeIn>
			<>
				<ProfileContent
					initLoad={initLoad}
					user={user}
					isUserLoading={isUserLoading}
					isPostsLoading={isPostsLoading}
					onDeletePost={onDeletePost}
					onClickLoadMore={loadMore}
					hasMorePosts={hasMore}
					feed={feed}
					updateUserProfileInfo={updateUser}
					refetchFeed={refetchFeed}
				>
					{isEditorVisible && (
						<Editor
							isOpen={true}
							onChange={_val => console.log('printed')}
							onSubmit={onSubmitPost}
							friendsList={friendsNamesList}
						/>
					)}
				</ProfileContent>
				<div ref={chatEndRef} id='end' />
			</>
		</FadeIn>
	);
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
