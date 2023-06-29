/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async redirects() {
		return [
			{
				source: '/',
				destination: '/login',
				permanent: true,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.ibb.co',
				pathname: '/**/*',
			},
		],
	},
	compiler: {
		styledComponents: true,
	},
};

module.exports = nextConfig;
