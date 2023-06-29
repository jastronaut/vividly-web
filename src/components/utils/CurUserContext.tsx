import { useLocalStorage } from '@mantine/hooks';
import { createContext, useContext, useState, useCallback } from 'react';

import { CurUser, User } from '@/types/user';
import { STORAGE_CUR_USER_KEY } from '@/constants';

type CurUserContext = {
	isLoading: boolean;
	curUser: CurUser;
	updateCurUser: (user: User) => void;
};

const CurUserContext = createContext<CurUserContext>({} as CurUserContext);

export const useCurUserContext = () => {
	return useContext(CurUserContext);
};

type Props = {
	children: React.ReactNode;
};

export const CurUserProvider = ({ children }: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [curUserData, setCurUserData] = useLocalStorage({
		key: STORAGE_CUR_USER_KEY,
		defaultValue: {} as CurUser,
	});

	const updateCurUser = useCallback(
		async (user: User) => {
			setIsLoading(true);
			const newCurUser = {
				...curUserData,
				user: {
					...curUserData.user,
					...user,
				},
			};
			setCurUserData(newCurUser);
			setIsLoading(false);
		},
		[curUserData]
	);

	return (
		<CurUserContext.Provider
			value={{
				isLoading,
				curUser: curUserData,
				updateCurUser,
			}}
		>
			{children}
		</CurUserContext.Provider>
	);
};
