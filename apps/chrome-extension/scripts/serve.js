const { spawn } = require('child_process');
const { copy } = require('fs-extra');

/**
 * This helper script is used run the serve for the chrome-extension, via
 * a build-watch **and** automatically move static files required
 * for the chrome-extension.
 */
(() => {
  try {
    console.log('>> running custom serve script for chrome-extension app');

    console.log('>> building chrome-extension app with watch flag...');
    let initialBuildDone = false;
    // Run the following steps in parallel:
    const build = spawn(`nx`, [
      'run',
      'chrome-extension:_build:development',
      '--watch',
    ]);

    build.stdout.on('data', async (e) => {
      const output = e.toString();
      console.log(output);
      if (output.includes('webpack compiled') && !initialBuildDone) {
        initialBuildDone = true;
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
      }
    });

    build.stderr.on('data', (e) => {
      console.error('' + e);
    });

    build.on('error', (err) => {
      throw err;
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
