export interface GoogleAnalyticsProps {
  /**
   * The google analytics tracking key.
   * If not added this component will render nothing.
   *
   * **This could be a security risk if dynamic.**
   */
  googleAnalyticsKey?: string;
}

/**
 * A component that adds <script> tags to the document to
 * add and provide google analytics. This should be added
 * to the <head> of the document once.
 *
 * @param props component props
 * @see GoogleAnalyticsProps
 */
export function GoogleAnalytics(props: GoogleAnalyticsProps) {
  return props.googleAnalyticsKey ? (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${props.googleAnalyticsKey}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${props.googleAnalyticsKey}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  ) : null;
}
