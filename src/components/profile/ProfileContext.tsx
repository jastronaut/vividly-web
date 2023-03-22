import { createContext, useContext, useState } from 'react';

import { User } from '../../types/user';

type ProfileContext = {
	isLoading: boolean;
	profileData?: User;
};

const ProfileContext = createContext<ProfileContext>({} as ProfileContext);

export const useProfileContext = () => {
	return useContext(ProfileContext);
};

type Props = {
	children: React.ReactNode;
	id: string;
};

export const ProfileProvider = ({ children, id }: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	return (
		<ProfileContext.Provider
			value={{
				isLoading,
			}}
		>
			{children}
		</ProfileContext.Provider>
	);
};
