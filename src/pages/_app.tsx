import { AppProps } from 'next/app';
import { NextPage } from 'next';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import * as Sentry from '@sentry/nextjs';

import { fetcher } from '../utils';
import { Layout } from '../components/layout/Layout';

// Sentry.init({
// 	environment: process.env.NODE_ENV,
// 	enabled: process.env.NODE_ENV === 'production',
// });

export type Page<P = unknown> = NextPage<P> & {
	getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type Props = AppProps & {
	Component: Page;
};

export default function App({ Component, pageProps }: Props) {
	const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

	return (
		<>
			<Head>
				<title>Vividly</title>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
				/>
			</Head>
			<SWRConfig
				value={{
					fetcher: fetcher,
				}}
			>
				<Layout>{getLayout(<Component {...pageProps} />)}</Layout>
			</SWRConfig>
		</>
	);
}
