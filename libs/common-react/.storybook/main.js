const rootMain = require('../../../.storybook/main');

/**
 * @type {import('@storybook/core-common').StorybookConfig}
 */
module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: 'webpack5' },

  stories: [
    ...rootMain.stories,
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    ...rootMain.addons,
    '@nrwl/react/plugins/storybook',
    // {
    //   /**
    //    * Fix Storybook issue with PostCSS@8
    //    *
    //    * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
    //    */
    //   name: '@storybook/addon-postcss',
    //   options: {
    //     postcssLoaderOptions: {
    //       implementation: require('postcss'),
    //     },
    //   },
    // },
  ],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

    // add your own webpack tweaks if needed

    return config;
  },
};
