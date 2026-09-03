import { throwKlear360Error, logger } from './logger';

describe('throwKlear360Error', () => {
  it('should throw an error with the correct message', () => {
    expect(() => throwKlear360Error({ message: 'Test Error' })).toThrowError(
      '[Klear360]: Test Error',
    );
  });

  it('should throw an error with the correct message and moduleName', () => {
    expect(() => throwKlear360Error({ message: 'Test Error', moduleName: 'ModuleX' })).toThrowError(
      '[Klear360: ModuleX]: Test Error',
    );
  });
});

describe('logger', () => {
  // Mock console methods to capture logs during tests
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

  afterEach(() => {
    // Clear mock console methods after each test
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
    mockConsoleLog.mockClear();
  });

  it('should log an error message without the module name', () => {
    logger({ message: 'Test Error', type: 'error' });
    expect(mockConsoleError).toHaveBeenCalledWith('[Klear360]: Test Error');
  });

  it('should log an error message with the correct prefix', () => {
    logger({ message: 'Test Error', moduleName: 'ModuleX', type: 'error' });
    expect(mockConsoleError).toHaveBeenCalledWith('[Klear360: ModuleX]: Test Error');
  });

  it('should log a warning message with the correct prefix', () => {
    logger({ message: 'Test Warning', moduleName: 'ModuleY', type: 'warn' });
    expect(mockConsoleWarn).toHaveBeenCalledWith('[Klear360: ModuleY]: Test Warning');
  });

  it('should log a regular message with the correct prefix', () => {
    logger({ message: 'Test Log', moduleName: 'ModuleZ', type: 'log' });
    expect(mockConsoleLog).toHaveBeenCalledWith('[Klear360: ModuleZ]: Test Log');
  });
});
