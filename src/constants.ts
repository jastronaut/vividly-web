export const STORAGE_CUR_USER_KEY = 'vividly.curUserData';
export const STORAGE_THEME_KEY = 'vividly.theme';

export const DEFAULT_AVATAR = `https://i.ibb.co/CnxM4Hj/grid-0-2.jpg`;

export const uri =
	process.env.VIVIDLY_API_URI ||
	process.env.NEXT_PUBLIC_VIVIDLY_API_URI ||
	'http://localhost:1337/v0/';

export const URL_PREFIX =
	process.env.VIVIDLY_API_URI ||
	process.env.NEXT_PUBLIC_VIVIDLY_API_URI ||
	'http://localhost:1337/v0';

export const IMGBB_API_KEY =
	process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.IMGBB_API_KEY;
