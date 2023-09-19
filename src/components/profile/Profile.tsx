import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import { addQuote, withEmbeds } from '../editor/utils';
import { showAndLogErrorNotification } from '@/showerror';
import { uri } from '@/constants';
import { Block, Post } from '@/types/post';
import { useCurUserContext } from '@/components/contexts/CurUserContext';
import { useFriendsContext } from '@/components/contexts/FriendsContext';
import { BlockType } from '@/types/post';

import { ProfileContent } from '@/components/profile/content/ProfileContent';
import { Editor } from '../editor/Editor';
import { FadeIn } from '@/styles/Animations';
import { useProfileContext } from '@/components/contexts/ProfileFeedContext';
import { useFeedContext } from '../contexts/FeedContext';
import { NextUserBanner } from './NextUserBanner';
import { PostDrawer } from './PostDrawer/PostDrawer';
import { PostDrawerProvider } from '../contexts/PostDrawerContext';

type PageProps = {
	id: string;
};

const Profile = (props: PageProps) => {
	const { id } = props;
	const { curUser, updateCurUser } = useCurUserContext();
	const { token } = curUser;
	const router = useRouter();
	const { feed: friendsFeed } = useFeedContext();

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

	const [editor] = useState(() =>
		withHistory(withReact(withEmbeds(createEditor())))
	);

	// map friends response to array of objects containing a friend's name and username
	const friendsNamesList = friends
		? friends.map(friend => ({
				name: friend.friend.name,
				username: friend.friend.username,
		  }))
		: [];

	const nextFriendship = friendsFeed[0];
	const isLoggedInUser = !!user && curUser.user.id === user.user.id;

	const onSubmitPost = (blocks: Block[]) => {
		setInitLoad(false);
		addPostFromBlocks(blocks);
		setInitLoad(true);
		if (chatEndRef.current) {
			window.scrollTo({
				top: chatEndRef.current.offsetTop,
				// behavior: 'smooth',
			});
		}
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

	const onClickQuotePost = (post: Post) => {
		addQuote(editor, {
			type: BlockType.QUOTE,
			postId: post.id,
			preview: post.content[0],
		});
		scrollToBottom();
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

	useLayoutEffect(() => {
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
				<PostDrawerProvider>
					<ProfileContent
						initLoad={initLoad}
						user={user}
						isUserLoading={isUserLoading}
						isPostsLoading={isPostsLoading}
						onDeletePost={onDeletePost}
						onClickLoadMore={loadMore}
						hasMorePosts={hasMore}
						feed={feed}
						isLoggedInUser={isLoggedInUser}
						onClickQuotePost={onClickQuotePost}
					>
						{isEditorVisible && (
							<Editor
								isOpen={true}
								onChange={_val => console.log('printed')}
								onSubmit={onSubmitPost}
								friendsList={friendsNamesList}
								onClickMagicPostActions={scrollToBottom}
								editor={editor}
							/>
						)}
					</ProfileContent>
					<div ref={chatEndRef} id='end' />
					<NextUserBanner
						nextFriendship={nextFriendship}
						user={user?.user}
						isLoading={isUserLoading || isPostsLoading}
						isLoggedInUser={isLoggedInUser}
					/>
					<PostDrawer onClickQuotePost={onClickQuotePost} />
				</PostDrawerProvider>
			</>
		</FadeIn>
	);
};

export default Profile;
