import { useCallback } from 'react';

import { SetState } from 'utils/types';

import { CheckStatus, LogMessage, StreamDiagnosticsEnum, TestResult } from './utils';

type DefaultResultProperties = {
  id: StreamDiagnosticsEnum;
  name: string;
  description: string;
};

const useAddStreamDiagnosticsResult = (
  setResults: SetState<TestResult[]>,
  defaultResultProperties: DefaultResultProperties
) => {
  const addResult = useCallback(
    (status: CheckStatus, log: LogMessage) =>
      setResults((prev) => {
        const hasResultAlready = prev.some(({ id }) => id === defaultResultProperties.id);
        if (hasResultAlready) {
          return prev.map((result) =>
            result.id === defaultResultProperties.id ? { ...result, status, logs: [...result.logs, log] } : result
          );
        }

        return [...prev, { ...defaultResultProperties, logs: [log], status }];
      }),
    [defaultResultProperties, setResults]
  );

  const addFailedResult = useCallback(
    (message: string) => addResult(CheckStatus.FAILED, { level: 'error', message }),
    [addResult]
  );

  return { addResult, addFailedResult };
};

export default useAddStreamDiagnosticsResult;
