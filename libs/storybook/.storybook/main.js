const rootMain = require('../../../.storybook/main');

module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: 'webpack5' },

  stories: [
    ...rootMain.stories,
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [...rootMain.addons, '@nrwl/react/plugins/storybook'],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

    // add your own webpack tweaks if needed

    return config;
  },
  refs: {
    'common-react': {
      title: 'common-react',
      url: 'common-react/',
    },
    apod: {
      title: 'apod',
      url: 'apod/',
    },
    neows: {
      title: 'neows',
      url: 'neows/',
    },
    'app-bar': {
      title: 'app-bar',
      url: 'app-bar/',
    },
  },
};
