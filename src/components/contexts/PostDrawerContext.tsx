import { createContext, useContext, useState, useCallback } from 'react';

type PostDrawerContextProps = {
	isOpen: boolean;
	closePostId: () => void;
	postId: number;
	setPostId: (postId: number) => void;
};

export const PostDrawerContext = createContext<PostDrawerContextProps>({
	isOpen: false,
	closePostId: () => {},
	postId: 0,
	setPostId: () => {},
});

export const usePostDrawerContext = () => useContext(PostDrawerContext);

type PostDrawerProviderProps = {
	children: React.ReactNode;
};

export const PostDrawerProvider = (props: PostDrawerProviderProps) => {
	const [isOpen, setOpen] = useState(false);
	const [postId, setPostId] = useState(0);

	const setIdAndOpen = useCallback((id: number) => {
		setPostId(id);
		setOpen(true);
	}, []);

	const clearIdAndClose = useCallback(() => {
		setPostId(0);
		setOpen(false);
	}, []);

	return (
		<PostDrawerContext.Provider
			value={{
				isOpen,
				postId,
				setPostId: setIdAndOpen,
				closePostId: clearIdAndClose,
			}}
		>
			{props.children}
		</PostDrawerContext.Provider>
	);
};
