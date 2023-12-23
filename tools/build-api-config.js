require('dotenv').config();
const { promises: fs } = require('fs');
const { writeFile, stat, mkdir } = fs;

(async () => {
  try {
    console.log('writing to dist/apps/chrome-extension/api-config.json');
    await stat('dist')
      .then((fsStat) => {
        if (!fsStat.isDirectory())
          throw new Error(
            'dist is not a folder, cannot continue, run npm run clean'
          );
        return true;
      })
      .catch((err) => {
        if (err.code === 'ENOENT') return mkdir('dist');
        throw err;
      });
    await writeFile(
      'dist/api-config.json',
      JSON.stringify(
        {
          apiKey: process.env.API_KEY ?? '',
        },
        null,
        2
      )
    );
    console.log('done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
