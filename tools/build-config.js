const { promises: fs } = require('fs');
const { writeFile, stat, mkdir } = fs;

/**
 * This script creates a dist/config.json file with some basic git meta-data.
 * Useful to debug builds.
 *
 * This should only be executed within a github-actions workflow, as the it provides
 * the necessary environment variables.
 *
 * Run with:
 * ```
 * npm run build:config
 * ```
 */
(async () => {
  try {
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
      'dist/config.json',
      JSON.stringify(
        (() => {
          const common = {
            sha: process.env.GITHUB_SHA ?? '',
            ref_type: process.env.GITHUB_REF_TYPE ?? '',
            date: new Date(),
          };
          if (process.env.GITHUB_REF_TYPE === 'branch')
            return {
              ...common,
              branch: process.env.GITHUB_REF ?? '',
            };
          // Fallback just return tag, as branch release models usually are used.
          return {
            ...common,
            tag: process.env.GITHUB_REF ?? '',
          };
        })(),
        null,
        2
      )
    );
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
