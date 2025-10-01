import logger, { LogValue } from './faro';

const createScopedLogger = (prefix: LoggerNamespace) => ({
  trace: <T>(message: string, value?: LogValue<T>) =>
    logger.trace(`${prefix} ${message}`, value),
  debug: <T>(message: string, value?: LogValue<T>) =>
    logger.debug(`${prefix} ${message}`, value),
  info: <T>(message: string, value?: LogValue<T>) =>
    logger.info(`${prefix} ${message}`, value),
  warn: <T>(message: string, value?: LogValue<T>) =>
    logger.warn(`${prefix} ${message}`, value),
  error: <T>(message: string, value?: LogValue<T>) =>
    logger.error(`${prefix} ${message}`, value),
});

export enum LoggerNamespace {
  MATRIX_AUTH = '[Matrix Auth]',
  MATRIX_STORES = '[Matrix Stores]',
}

export const authLogger = createScopedLogger(LoggerNamespace.MATRIX_AUTH);
export const storesLogger = createScopedLogger(LoggerNamespace.MATRIX_STORES);
