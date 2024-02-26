declare global {
	namespace NodeJS {
		interface ProcessEnv {
			FOURSQUARE_API_KEY: string;
			SENTRY_DSN: string;
			VIVIDLY_API_URI: string;
			IMGBB_API_KEY: string;
			GIPHY_API_KEY: string;
		}
	}
}

export {};
