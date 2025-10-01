import { useEffect } from 'react';

import logger from 'utils/logging/faro';

type LogValue<T> = T | T[];

//NOTE: Hook for watching a value or logging a message once when component loads
const useLogValue = <T>(message: string, values?: LogValue<T>) => {
  useEffect(() => {
    if (values === undefined) return logger.info(message);

    logger.info(message, values);
  }, [values, message]);
};

export default useLogValue;
