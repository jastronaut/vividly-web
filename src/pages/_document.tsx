import {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps,
} from 'next/document';
import { createGetInitialProps } from '@mantine/next';
import Document from 'next/document';
import { ServerStyles, createStylesServer } from '@mantine/next';
import { ServerStyleSheet } from 'styled-components';
const stylesServer = createStylesServer();

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
	static async getInitialProps(
		context: DocumentContext
	): Promise<DocumentInitialProps> {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = context.renderPage;

		try {
			context.renderPage = () =>
				originalRenderPage({
					enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
				});

			const initialProps = await Document.getInitialProps(context);
			return {
				...initialProps,
				styles: [
					<>
						{initialProps.styles}
						<ServerStyles html={initialProps.html} server={stylesServer} />
						{sheet.getStyleElement()}
					</>,
				],
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		return (
			<Html>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
