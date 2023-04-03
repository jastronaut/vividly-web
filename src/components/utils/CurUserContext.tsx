import { useLocalStorage } from '@mantine/hooks';
import { createContext, useContext, useState } from 'react';

import { CurUser } from '@/types/user';

type CurUserContext = {
	isLoading: boolean;
	curUser: CurUser;
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
		key: 'vividly.curUserData',
		defaultValue: {} as CurUser,
	});

	return (
		<CurUserContext.Provider
			value={{
				isLoading,
				curUser: curUserData,
			}}
		>
			{children}
		</CurUserContext.Provider>
	);
};
