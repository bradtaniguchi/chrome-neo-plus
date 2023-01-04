const { writeFile, access, F_OK } = require('fs/promises');

/**
 * This script is used to create the `build-config.ts` file that is then
 * bundled with the chrome-extension at build time.
 *
 * This isn't optimal, but its better than the original hard-coded solution.
 *
 * Run with:
 * ```bash
 * npm run prep:build-config
 * ```
 */
(async () => {
  try {
    const FILE_PATH = 'build-config.ts';
    const hasFile = access(FILE_PATH, F_OK)
      .then(() => true)
      .catch(() => false);
    if (hasFile) {
      console.log('File already exists, skipping');
      process.exit(0);
    }
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error('API_KEY env variable not set');
    }
    const config = JSON.stringify({
      API_KEY,
    });
    await writeFile(FILE_PATH, config, 'utf8');
    console.log('done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
