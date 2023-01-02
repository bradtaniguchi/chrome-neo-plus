import { CommonLogger } from '@nx-template/common';
import { promises as fsPromises } from 'fs';
import * as child_process from 'child_process';
const { stat, mkdir } = fsPromises;
import util from 'util';
import { ProjectGraph } from 'nx/src/config/project-graph';
const exec = util.promisify(child_process.exec);

/**
 * Creates the nx-graph file then loads and returns it.
 * This creates the file at `dist/nx-graph/graph.json`
 */
export const loadNxGraph = async (): Promise<ProjectGraph> => {
  const filePath = 'dist/nx-graph/graph.json';
  const logger = new CommonLogger();

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

    await exec(`npx nx graph --file=${filePath}`);

    // read file from system at filePath
    const nxGraphStr = await fsPromises.readFile(filePath, 'utf8');

    return JSON.parse(nxGraphStr).graph;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
