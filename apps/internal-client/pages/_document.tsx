/* eslint-disable react/display-name */
import { ReactElement } from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { GoogleAnalytics } from '@nx-template/common-react';

export default class CustomDocument extends Document<{
  styleTags: ReactElement[];
}> {
  static async getInitialProps(context: DocumentContext) {
    const { renderPage } = context;

    const initialProps = await Document.getInitialProps(context);

    const sheet = new ServerStyleSheet();

    const page = renderPage(
      (App) => (props) => sheet.collectStyles(<App {...props} />)
    );

    const styleTags = sheet.getStyleElement();

    return { ...initialProps, ...page, styleTags };
  }

  render() {
    return (
      <Html style={{ visibility: 'hidden' }}>
        <Head>
          {this.props.styleTags}
          {
            <GoogleAnalytics
              googleAnalyticsKey={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}
            />
          }
        </Head>
        <body className="min-h-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
