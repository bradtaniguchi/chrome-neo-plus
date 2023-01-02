/**
 * Represents the data that is created from the build-config.js script.
 * Can be loaded via the `getConfig` function.
 *
 * @see getConfig
 */
export interface BaseConfig {
  sha: string;
  ref_type: 'tag' | 'branch';
  /**
   * The branch name, only given if ref_type is branch
   */
  branch?: string;
  /**
   * The tag name, only given if ref_type is tag
   */
  tag?: string;
}
