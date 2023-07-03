import { createContext, useContext, useCallback, useEffect } from 'react';
import useSWR from 'swr';

import { AuthUser } from '@/types/user';
import { AuthInfoResponse } from '@/types/api';
import { useCurUserContext } from './CurUserContext';
import { URL_PREFIX } from '@/constants';
import { fetchWithToken } from '@/utils';
import { showAndLogErrorNotification } from '@/showerror';

type AccountInfoContext = {
	isLoading: boolean;
	accountInfo?: AuthInfoResponse;
	updateAccountInfo: (accountInfo: AuthUser) => void;
};

const AccountInfoContext = createContext<AccountInfoContext>(
	{} as AccountInfoContext
);

export const useAccountInfoContext = () => {
	return useContext(AccountInfoContext);
};

type Props = {
	children: React.ReactNode;
};

export const AccountInfoProvider = ({ children }: Props) => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const { data, error, isLoading, mutate } = useSWR<AuthInfoResponse>(
		[token ? `${URL_PREFIX}/auth/info` : '', token],
		// @ts-ignore
		([url, token]) => fetchWithToken(url, token),
		{ shouldRetryOnError: true }
	);

	// update account info
	const updateAccountInfo = useCallback(
		(accountInfo: AuthUser) => {
			mutate(data => {
				if (data) {
					return {
						...data,
						authInfo: accountInfo,
					};
				}
				return data;
			});
		},
		[data]
	);

	useEffect(() => {
		if (error) {
			showAndLogErrorNotification(`Couldn't load account info.`, error);
		}
	}, [error]);

	return (
		<AccountInfoContext.Provider
			value={{
				isLoading,
				accountInfo: data,
				updateAccountInfo,
			}}
		>
			{children}
		</AccountInfoContext.Provider>
	);
};
