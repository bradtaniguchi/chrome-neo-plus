import { BaseConfig } from '../types/base-config';

/**
 * Returns the config file that is generated via the build-config.js script.
 * This script includes metadata about the build itself.
 *
 * @param params the function params object
 * @param params.path The path to the config file, otherwise defaults to `config.json`
 * @param params.overrides Override options to use if there is an error, or override
 *   the values within the config file.
 */
export const getConfig = <AppConfig extends object>(params?: {
  path?: string;
  overrides?: Partial<BaseConfig & AppConfig>;
}): Promise<BaseConfig & AppConfig> => {
  const { path, overrides } = params ?? {};
  return fetch(path ?? 'config.json')
    .then((r) => r.json())
    .then((config) => ({ ...config, ...overrides }))
    .catch((err) => {
      if (overrides) return overrides;
      throw err;
    });
};
