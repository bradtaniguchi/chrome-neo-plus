export type CommonLoggerLogLevels = 'log' | 'debug' | 'warn' | 'error';

/**
 * Configuration object for the common-logger.
 */
export interface CommonLoggerConfig {
  /**
   * String added to the front of the logger instance.
   */
  prefix?: string;

  /**
   * List of hidden methods for the common-logger.
   */
  hidden?: Array<CommonLoggerLogLevels>;

  /**
   * Function that can be passed to "hook" into the emitting of logs
   * over time.
   *
   * Useful for "hooking" into log being emitted.
   */
  onLog?: (params: {
    /**
     * The level called
     */
    level: CommonLoggerLogLevels;
    /**
     * The message given, usually a string
     */
    message: unknown;
    /**
     * The optional params given
     */
    optionalParams: Array<unknown>;
  }) => void;
}

/**
 * Simple but configurable logger. Should be used on the client-side
 * and script situations, due to being overridable, and upgradable
 */
export class CommonLogger {
  /**
   * The current prefix provided from the config.
   */
  public get prefix(): string {
    return this.config?.prefix || '';
  }

  /**
   * The list of hidden methods, defined from the config object.
   */
  public get hidden(): Array<'log' | 'debug' | 'warn' | 'error'> {
    return this.config?.hidden || [];
  }

  /**
   * @param config configuration object for the logger
   */
  constructor(public config?: CommonLoggerConfig) {}

  /**
   * Type-guard for the onLog method.
   *
   * @param logFn the function to callback when a log is executed
   */
  private isOnLog(
    logFn: CommonLoggerConfig['onLog']
  ): logFn is Required<CommonLoggerConfig>['onLog'] {
    return typeof logFn === 'function';
  }

  /**
   * Logs message at the error level
   *
   * @param message the message to log at the error level
   * @param {...any} optionalParams optional params that will be passed along
   *   as arguments.
   */
  error(message?: unknown, ...optionalParams: unknown[]): void {
    if (this.hidden?.includes('error')) return;
    const onLog = this.config?.onLog;
    if (this.isOnLog(onLog))
      onLog({
        level: 'error',
        message,
        optionalParams,
      });
    console.error(this.prefix + message, ...optionalParams);
  }
  /**
   * Logs message at the log level
   *
   * @param message the message to log at the log level
   * @param {...any} optionalParams optional params that will be passed along
   *   as arguments.
   */
  log(message?: unknown, ...optionalParams: unknown[]): void {
    if (this.hidden?.includes('log')) return;
    const onLog = this.config?.onLog;
    if (this.isOnLog(onLog))
      onLog({
        level: 'log',
        message,
        optionalParams,
      });
    console.log(this.prefix + message, ...optionalParams);
  }

  /**
   * Logs message at the error debug
   *
   * @param message the message to log at the debug level
   * @param {...any} optionalParams optional params that will be passed along
   *   as arguments.
   */
  debug(message?: unknown, ...optionalParams: unknown[]): void {
    if (this.hidden?.includes('debug')) return;
    const onLog = this.config?.onLog;
    if (this.isOnLog(onLog))
      onLog({
        level: 'debug',
        message,
        optionalParams,
      });
    console.debug(this.prefix + message, ...optionalParams);
  }

  /**
   * Logs message at the error warn
   *
   * @param message the message to log at the warn level
   * @param {...any} optionalParams optional params that will be passed along
   *   as arguments.
   */
  warn(message?: unknown, ...optionalParams: unknown[]): void {
    if (this.hidden?.includes('warn')) return;
    const onLog = this.config?.onLog;
    if (this.isOnLog(onLog))
      onLog({
        level: 'warn',
        message,
        optionalParams,
      });
    console.warn(this.prefix + message, ...optionalParams);
  }
}
