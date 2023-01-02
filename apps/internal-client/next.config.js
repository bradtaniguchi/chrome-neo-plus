// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
  openAnalyzer: false,
});

module.exports = (() => {
  const isProd = process.env.NODE_ENV === 'production';
  const isAnalyze = process.env.ANALYZE == 'true';
  const isBare = process.env.BARE == 'true';

  if (isBare) return nextConfig;

  if (isAnalyze)
    return {
      ...withBundleAnalyzer(nextConfig),
      basePath: '/nx-template',
      assetPrefix: '/nx-template',
    };

  if (isProd)
    return {
      ...withNx(
        withSentryConfig(nextConfig, {
          silent: true,
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.SENTRY_ORG,
        })
      ),
      basePath: '/nx-template',
      assetPrefix: '/nx-template',
    };

  return withNx(nextConfig);
})();
