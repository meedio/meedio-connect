import { CheckInfo } from 'livekit-client';
import { MutableRefObject } from 'react';

import { FailureLevelsEnum } from 'pages/DiagnosticsPage/utils';

import { DiagnosticItem } from './getStreamDiagnosticsItems';

export enum StreamDiagnosticsEnum {
  WEBSOCKET,
  WEBRTC,
  TURN,
  AUDIO_OUTPUT,
  VIDEO_OUTPUT,
  AUDIO,
  VIDEO,
  SCREEN_SHARING,
  RECONNECTION,
}

export enum CheckStatus {
  IDLE,
  RUNNING,
  SKIPPED,
  SUCCESS,
  FAILED,
}

export type LogMessage = {
  level: 'info' | 'warning' | 'error';
  message: string;
};

export const initialStreamDiagnosticTest = StreamDiagnosticsEnum.WEBSOCKET;
export const streamDiagnosticsCount = Object.keys(StreamDiagnosticsEnum).length / 2;

export type TestResult = CheckInfo & {
  id: StreamDiagnosticsEnum;
};

export const getFailedTestsCount = (results: TestResult[], diagnosticItems: DiagnosticItem[]) =>
  results.reduce(
    (acc, result) => {
      if (![CheckStatus.FAILED, CheckStatus.SKIPPED].includes(result.status)) return acc;

      const diagnosticItem = diagnosticItems.find(({ id }) => id === result.id);
      if (!diagnosticItem) return acc;

      const { failureLevel } = diagnosticItem;

      if (failureLevel === FailureLevelsEnum.WARNING || result.status === CheckStatus.SKIPPED) acc.warningCount++;
      else if (failureLevel === FailureLevelsEnum.CRITICAL) acc.criticalCount++;

      return acc;
    },
    { criticalCount: 0, warningCount: 0 },
  );

type StreamDiagnostic = {
  id: StreamDiagnosticsEnum;
  callback: () => Promise<CheckInfo | void> | void;
};

export const runDiagnostics = async (
  diagnostics: StreamDiagnostic[],
  isCanceledRef: MutableRefObject<boolean>,
  setCurrent: (id: StreamDiagnosticsEnum) => void,
) => {
  for (let i = 0; i < diagnostics.length; i++) {
    if (isCanceledRef.current) return;

    const { id, callback } = diagnostics[i];

    setCurrent(id);
    await callback();
  }
};
