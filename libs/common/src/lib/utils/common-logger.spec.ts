import { CommonLogger, CommonLoggerConfig } from './common-logger';

describe('CommonLogger', () => {
  let logger: CommonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new CommonLogger();
    consoleLogSpy = jest.spyOn(console, 'log');
    consoleErrorSpy = jest.spyOn(console, 'error');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });
  it('should log to console.log', () => {
    logger.log('test');
    expect(consoleLogSpy).toHaveBeenCalled();
  });
  it('should log to console.error', () => {
    logger.error('test');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
  it('should provide hidden log if given', () => {
    logger = new CommonLogger({ hidden: ['log'] });
    logger.log('test');
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
  it('should not log to console.log if log is set to hidden', () => {
    logger = new CommonLogger({ hidden: ['log'] });
    logger.log('test');
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
  it('should not log to console.error if error is set to hidden', () => {
    logger = new CommonLogger({ hidden: ['error'] });
    logger.error('test');
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
  it('should still log to console.log if error is set to hidden', () => {
    logger = new CommonLogger({ hidden: ['error'] });
    logger.log('test');
    expect(consoleLogSpy).toHaveBeenCalled();
  });
  it('should use prefix', () => {
    logger = new CommonLogger({ prefix: '[prefix] ' });
    logger.log('test');
    expect(consoleLogSpy).toHaveBeenCalledWith('[prefix] test');
  });
  it('should use onLog', () => {
    const onLog = jest.fn();
    logger = new CommonLogger({ onLog });
    logger.log('test');
    expect(consoleLogSpy).toHaveBeenCalledWith('test');
    expect(onLog).toHaveBeenCalledWith({
      level: 'log',
      message: 'test',
      optionalParams: [],
    } as Parameters<Required<CommonLoggerConfig>['onLog']>[0]);
  });
});
