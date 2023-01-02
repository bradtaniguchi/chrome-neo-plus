import { ProjectGraph } from '@nrwl/devkit';

/**
 * Returns the nx-graph.json file that is generated via nx graph.
 *
 * @param params the function parameters object
 * @param params.path The path to the config file, otherwise defaults to `nx-graph/graph.json`
 * @param params.overrides Override options to use if there is an error, or override
 *   the values within the graph file.
 */
export const getNxGraph = (params?: {
  path?: string;
  overrides?: Partial<ProjectGraph>;
}): Promise<ProjectGraph> => {
  const { path, overrides } = params ?? {};
  return fetch(path ?? 'nx-graph/graph.json')
    .then((r) => r.json())
    .then((data) => ({ ...overrides, ...(data.graph ?? {}) }))
    .catch((err) => {
      if (overrides) return overrides;
      throw err;
    });
};
