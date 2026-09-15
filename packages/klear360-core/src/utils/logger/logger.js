const PREFIX = '[Klear360]:';

/**
 * @param {{message: string, moduleName?: string}} options
 * @returns {void | never}
 */
const throwKlear360Error = ({ message, moduleName }) => {
  if (__DEV__) {
    const prefix = moduleName ? `[Klear360: ${moduleName}]:` : PREFIX;
    throw new Error(`${prefix} ${message}`);
  }
};

/**
 * @param {'error' | 'warn' | 'log'} type
 * @returns {typeof console.log | typeof console.error | typeof console.warn}
 */
const getCommonLogger = (type) => {
  switch (type) {
    case 'error':
      return console.error;
    case 'warn':
      return console.warn;
    case 'log':
    default:
      return console.log;
  }
};

/**
 * @param {{message: string, moduleName?: string, type: 'error' | 'warn' | 'log'}} options
 * @returns {void}
 */
const logger = ({ message, moduleName, type }) => {
  if (__DEV__) {
    const prefix = moduleName ? `[Klear360: ${moduleName}]:` : PREFIX;
    getCommonLogger(type)(`${prefix} ${message}`);
  }
};

export { throwKlear360Error, logger };
