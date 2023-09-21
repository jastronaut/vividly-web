export const STORAGE_CUR_USER_KEY = 'vividly.curUserData';
export const STORAGE_THEME_KEY = 'vividly.theme';
export const STORAGE_SYSTEM_THEME = 'useSystemTheme';
export const STORAGE_ACCENT_COLOR = 'vividly.accentColor';
export const STORAGE_USE_CELSIUS = 'vividly.useCelsius';
export const STORAGE_USE_24HOUR_TIME = 'vividly.use24HourTime';
export const STORAGE_DATE_FORMAT = 'vividly.dateFormat';

export const DEFAULT_AVATAR = `https://i.ibb.co/CnxM4Hj/grid-0-2.jpg`;

export const uri =
	process.env.VIVIDLY_API_URI ||
	process.env.NEXT_PUBLIC_VIVIDLY_API_URI ||
	'http://localhost:1337/v0';

export const URL_PREFIX =
	process.env.VIVIDLY_API_URI ||
	process.env.NEXT_PUBLIC_VIVIDLY_API_URI ||
	'http://localhost:1337/v0';

export const IMGBB_API_KEY =
	process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.IMGBB_API_KEY;

export const SENTRY_DSN =
	process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

export const FOURSQUARE_API_KEY =
	process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || process.env.FOURSQUARE_API_KEY;
