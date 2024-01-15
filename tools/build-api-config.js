require('dotenv').config();
const { promises: fs } = require('fs');
const { writeFile, stat, mkdir } = fs;

(async () => {
  try {
    console.log(
      'writing to dist/apps/chrome-extension/api-config.json and storybook-public/api-config.json'
    );

    const createFolder = (folder) =>
      stat(folder)
        .then((fsStat) => {
          if (!fsStat.isDirectory())
            throw new Error(
              'dist is not a folder, cannot continue, run npm run clean'
            );
          return true;
        })
        .catch((err) => {
          if (err.code === 'ENOENT') return mkdir(folder);
          throw err;
        });

    await Promise.all([createFolder('dist'), createFolder('storybook-public')]);

    const writeJsonFile = (file) =>
      writeFile(
        file,
        JSON.stringify(
          {
            apiKey: process.env.API_KEY ?? '',
          },
          null,
          2
        )
      );

    await Promise.all([
      writeJsonFile('dist/api-config.json'),
      writeJsonFile('storybook-public/api-config.json'),
    ]);

    console.log('done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
