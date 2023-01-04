const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { writeFile, access, F_OK } = require('fs/promises');
const { join } = require('path');
require('dotenv').config();

/**
 * This helper script is used to build the library
 */
(async () => {
  try {
    console.log('>> running custom build script for common library');

    const FILE_PATH = '../src/lib/constants/build-config.ts';
    const hasFile = await access(FILE_PATH, F_OK)
      .then(() => true)
      .catch(() => false);
    if (hasFile) {
      console.log('>> file already exists, skipping');
    } else {
      console.log(
        '>> build-config file not found, creating from environment variables'
      );
      const API_KEY = process.env.API_KEY;
      if (!API_KEY) {
        throw new Error('API_KEY env variable not set');
      }
      const config = `
export default {
  API_KEY: "${API_KEY}"
};

`;
      await writeFile(join(__dirname, FILE_PATH), config, 'utf8');
    }

    // **Note** this is the internal nx-focus "build" command
    await exec('nx run common:_build:production');

    console.log('>> done building common library');

    console.log('>> done!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
