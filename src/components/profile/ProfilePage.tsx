import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { showAndLogErrorNotification } from '@/showerror';
import { uri } from '@/constants';
import { Block } from '@/types/post';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { useFriendsContext } from '@/components/utils/FriendsContext';

import { ProfileContent } from '@/components/profile/content/ProfileContent';
import { Editor } from '../editor/Editor';
import { FadeIn } from '@/styles/Animations';
import { useProfileContext } from '@/components/utils/ProfileFeedContext';

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

	const onSubmitPost = (blocks: Block[]) => {
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

	const scrollToBottom = () => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
		if (chatEndRef.current && window) {
			setInitLoad(true);
			// chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
			window.scrollTo(0, chatEndRef.current.offsetTop);
		}
		return () => {
			console.log('reset init load');
			setInitLoad(true);
		};
	}, [id]);

	useEffect(() => {
		mutatePosts(undefined, true);
		// fetchFriends(true);
		refetchFriends();
		setInitLoad(true);
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
			!isUserLoading &&
			typeof window !== undefined
		) {
			// chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
			window.scrollTo({
				top: chatEndRef.current.offsetTop,
				// behavior: 'smooth',
			});
			setInitLoad(false);
		}
	}, [feed, initLoad, isPostsLoading, isUserLoading]);

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
				>
					{isEditorVisible && (
						<Editor
							isOpen={true}
							onChange={_val => console.log('printed')}
							onSubmit={onSubmitPost}
							friendsList={friendsNamesList}
							onClickMagicPostActions={scrollToBottom}
						/>
					)}
				</ProfileContent>
				<div ref={chatEndRef} id='end' />
			</>
		</FadeIn>
	);
};

export default Profile;
