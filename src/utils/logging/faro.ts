import { Faro, LogLevel } from '@grafana/faro-react';

import initFaro from 'utils/logging/initFaro';

export type LogValue<T> = T | T[];

let faroInstance: Faro | undefined;

if (import.meta.env.REACT_APP_ALLOY_URL && import.meta.env.REACT_APP_ALLOY_API_KEY) faroInstance = initFaro();

//NOTE: fallback for when there's no env variables to initialize faro
const noOp = () => null;

const createLogMethod =
  <T>(level: LogLevel) =>
  (message: string, value?: LogValue<T>) => {
    const pushLog = faroInstance?.api.pushLog ?? noOp;

    if (import.meta.env.DEV) console.log(message, value);

    pushLog([message, value], { level, skipDedupe: true });
  };

const logger = {
  trace: createLogMethod(LogLevel.TRACE),
  debug: createLogMethod(LogLevel.DEBUG),
  info: createLogMethod(LogLevel.INFO),
  warn: createLogMethod(LogLevel.WARN),
  error: createLogMethod(LogLevel.ERROR),
};

export default logger;
