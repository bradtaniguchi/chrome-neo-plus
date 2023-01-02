const util = require('util');
const exec = util.promisify(require('child_process').exec);
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
/**
 * This script is used with github-actions and returns a JSON string
 * that contains an array of affected projects for the list of defined
 * targets.
 *
 * This should be used to know if a given project needs to be executed, or skipped
 * completely. Unlike previous versions, this is an "all or nothing" approach.
 */
(async () => {
  try {
    const TARGETS = ['lint', 'test', 'build', 'lighthouse'];

    const { branch } = argv;
    const isMaster = branch === 'refs/heads/main';
    const baseSha = isMaster ? 'origin/main~1' : 'origin/main';

    const affectedProjectsStr = await Promise.all(
      TARGETS.map((target) =>
        exec(
          `npx nx print-affected --base=${baseSha} --target=${target} --select=projects`
        ).then((res) => res.stdout.toString('utf-8'))
      )
    ).then((affectedProjects) => affectedProjects.join(', '));

    const affectedProjects = Array.from(
      new Set([
        ...affectedProjectsStr
          .split(', ')
          .filter((project) => project !== '\n' && !!project)
          .map((project) => project.replace('\n', '')),
      ]).values()
    ).sort();

    console.log(JSON.stringify(affectedProjects, null));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
