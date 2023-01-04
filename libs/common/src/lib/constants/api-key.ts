/**
 * This is done for clarity sake, as the `build-config` file isn't kept track of
 * in source control.
 */
import buildConfig from './build-config';

/**
 * Redeclare the same variable for intellisense/linting.
 */
export const API_KEY = buildConfig.API_KEY;
