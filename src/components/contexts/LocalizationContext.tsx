import { useLocalStorage } from '@mantine/hooks';
import { createContext, useContext } from 'react';

import {
	STORAGE_USE_24HOUR_TIME,
	STORAGE_USE_CELSIUS,
	STORAGE_DATE_FORMAT,
} from '@/constants';

export const DateFormats = {
	US: 'dddd, MMMM D, YYYY',
	EU: 'dddd, D MMMM YYYY',
};

type LocalizationContext = {
	use24HourTime: boolean;
	useCelsius: boolean;
	dateFormat: string;
	toggleUse24HourTime: () => void;
	toggleUseCelsius: () => void;
	setDateFormat: (dateFormat: string) => void;
};

const LocalizationContext = createContext<LocalizationContext>(
	{} as LocalizationContext
);

export const useLocalizationContext = () => {
	return useContext(LocalizationContext);
};

type Props = {
	children: React.ReactNode;
};

export const LocalizationProvider = ({ children }: Props) => {
	const [use24HourTime, setUse24HourTime] = useLocalStorage({
		key: STORAGE_USE_24HOUR_TIME,
		defaultValue: false,
	});
	const [useCelsius, setUseCelsius] = useLocalStorage({
		key: STORAGE_USE_CELSIUS,
		defaultValue: false,
	});
	const [dateFormat, setDateFormat] = useLocalStorage({
		key: STORAGE_DATE_FORMAT,
		defaultValue: DateFormats.US,
	});

	const toggleUse24HourTime = () => {
		setUse24HourTime(!use24HourTime);
	};

	const toggleUseCelsius = () => {
		setUseCelsius(!useCelsius);
	};

	return (
		<LocalizationContext.Provider
			value={{
				use24HourTime,
				useCelsius,
				dateFormat,
				toggleUse24HourTime,
				toggleUseCelsius,
				setDateFormat,
			}}
		>
			{children}
		</LocalizationContext.Provider>
	);
};
