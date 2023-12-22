const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { copy } = require('fs-extra');

/**
 * This helper script is used to build the chrome-extension for
 * production environments.
 */
(async () => {
  try {
    console.log('>> running custom build script for chrome-extension app');

    console.log('>> building chrome-extension app with watch-flag');

    // **Note** this is the internal nx-focus "build" command
    await exec('nx run chrome-extension:_build:production');

    console.log(
      '>> done building chrome-extension, moving manifest and api-config.json'
    );

    await copy(
      'dist/api-config.json',
      'dist/apps/chrome-extension/api-config.json'
    );

    await copy(
      'apps/chrome-extension/src/manifest.json',
      'dist/apps/chrome-extension/manifest.json'
    );

    console.log('>> done moving manifest.json');

    console.log('>> done!');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
