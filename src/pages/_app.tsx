import { AppProps } from 'next/app';
import { NextPage } from 'next';
import Head from 'next/head';
import { SWRConfig } from 'swr';

import { fetcher } from '../utils';

import { Layout } from '../components/Layout';

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
					content='minimum-scale=1, initial-scale=1, width=device-width'
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
