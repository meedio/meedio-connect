import * as log from 'loglevel';

enum LoggerLevel {
  trace = 'trace',
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
  silent = 'silent',
}

type LoggerLevelString = keyof typeof LoggerLevel;

//NOTE: add new loggers here. Method log.getLogger creates, if not present, and returns the logger instance.
// You can then export it from here. The levels for each logger can be set separately
enum Loggers {
  Default = 'default',
}

export const defaultLoggerLevel = LoggerLevel.debug;
const logger = log.getLogger(Loggers.Default);

//NOTE: loglevel packages' debug method relies on console.log,
//not on console.debug, that's why it shows up in loki as info level.
//We can overwrite this behavior using methodFactory as discussed here: https://github.com/pimterry/loglevel/issues/126
const getAllLoggers = () => Object.values(Loggers).map((name) => log.getLogger(name));
export const setLoggerLevel = (level: LoggerLevel | LoggerLevelString, loggerName?: Loggers) => {
  if (loggerName) return log.getLogger(loggerName).setLevel(level);

  getAllLoggers().forEach((logger) => logger.setLevel(level));
};

export default logger;
