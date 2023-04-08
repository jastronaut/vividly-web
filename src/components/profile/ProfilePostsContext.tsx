import { createContext, useContext, useState } from 'react';

import { User } from '../../types/user';

type ProfilePostsContext = {
	isLoading: boolean;
	ProfilePostsData?: User;
};

const ProfilePostsContext = createContext<ProfilePostsContext>(
	{} as ProfilePostsContext
);

export const useProfilePostsContext = () => {
	return useContext(ProfilePostsContext);
};

type Props = {
	children: React.ReactNode;
	userId: string;
	postId?: string;
};

export const ProfilePostsProvider = ({ children, userId, postId }: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	return (
		<ProfilePostsContext.Provider
			value={{
				isLoading,
			}}
		>
			{children}
		</ProfilePostsContext.Provider>
	);
};
