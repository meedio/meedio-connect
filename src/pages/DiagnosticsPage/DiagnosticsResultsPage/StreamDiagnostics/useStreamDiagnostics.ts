import { faker } from '@faker-js/faker';
import { CheckInfo, ConnectionCheck } from 'livekit-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Diagnostics } from 'contexts/DiagnosticsStateProvider/DiagnosticsStateProvider';
import useDiagnosticsStateContext from 'contexts/DiagnosticsStateProvider/useDiagnosticsStateContext';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import logger from 'utils/logging/faro';
import { getSFUConfigWithOpenID } from 'utils/openIDSFU';

import getStreamDiagnosticsItems from './getStreamDiagnosticsItems';
import useAudioOutputDiagnostic from './useAudioOutputDiagnostic/useAudioOutputDiagnostic';
import useScreenShareDiagnostic from './useScreenShareDiagnostic/useScreenShareDiagnostic';
import useVideoOutputDiagnostic from './useVideoOutputDiagnostic/useVideoOutputDiagnostic';
import {
  getFailedTestsCount,
  initialStreamDiagnosticTest,
  runDiagnostics,
  StreamDiagnosticsEnum,
  TestResult,
} from './utils';

const useStreamDiagnostics = () => {
  const { t } = useTranslation();
  const { currentDiagnostic, isDiagnosticsRunning, endCurrentDiagnostic } = useDiagnosticsStateContext();
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState(initialStreamDiagnosticTest);
  const [tokens, setTokens] = useState<string[]>();
  const currentTestRef = useRef(initialStreamDiagnosticTest);
  const isCanceledRef = useRef(false);
  const { matrixClient } = useMatrixContext();
  const screenSharingDiagnostic = useScreenShareDiagnostic(setResults);
  const videoOutputDiagnostic = useVideoOutputDiagnostic(setResults, tokens);
  const audioOutputDiagnostic = useAudioOutputDiagnostic(setResults, tokens);

  const isReadyToRun = currentDiagnostic === Diagnostics.Stream && isDiagnosticsRunning;

  const getTokens = useCallback(async () => {
    const fakeRoomName = faker.string.uuid();

    const token = await getSFUConfigWithOpenID(
      matrixClient,
      {
        livekit_service_url: import.meta.env.REACT_APP_LIVEKIT_SERVICE_URL,
        livekit_alias: fakeRoomName,
        type: 'livekit',
      },
      true,
    );

    const token2 = await getSFUConfigWithOpenID(
      matrixClient,
      {
        livekit_service_url: import.meta.env.REACT_APP_LIVEKIT_SERVICE_URL,
        livekit_alias: fakeRoomName,
        type: 'livekit',
      },
      true,
    );

    setTokens([token.jwt, token2.jwt]);
  }, [matrixClient]);

  useEffect(() => {
    if (tokens?.length || !isReadyToRun) return;

    getTokens();
  }, [getTokens, isReadyToRun, tokens?.length]);

  useEffect(() => {
    if (!tokens?.length || !isReadyToRun) return;

    isCanceledRef.current = false;
    const checker = new ConnectionCheck(import.meta.env.REACT_APP_LIVEKIT_SERVER_URL, tokens[0]);

    const diagnostics = [
      { id: StreamDiagnosticsEnum.WEBSOCKET, callback: checker.checkWebsocket.bind(checker) },
      { id: StreamDiagnosticsEnum.WEBRTC, callback: checker.checkWebRTC.bind(checker) },
      { id: StreamDiagnosticsEnum.TURN, callback: checker.checkTURN.bind(checker) },
      { id: StreamDiagnosticsEnum.AUDIO_OUTPUT, callback: audioOutputDiagnostic },
      { id: StreamDiagnosticsEnum.VIDEO_OUTPUT, callback: videoOutputDiagnostic },
      { id: StreamDiagnosticsEnum.AUDIO, callback: checker.checkPublishAudio.bind(checker) },
      { id: StreamDiagnosticsEnum.VIDEO, callback: checker.checkPublishVideo.bind(checker) },
      { id: StreamDiagnosticsEnum.SCREEN_SHARING, callback: screenSharingDiagnostic },
      { id: StreamDiagnosticsEnum.RECONNECTION, callback: checker.checkReconnect.bind(checker) },
    ];

    const handleCheckUpdate = (_: number, info: CheckInfo) =>
      setResults((prev) => {
        const existingCheckIndex = prev.findIndex(({ description }) => description === info.description);
        if (existingCheckIndex > -1) {
          return prev.map((item, index) => (index === existingCheckIndex ? { ...item, ...info } : item));
        }

        return [...prev, { ...info, id: currentTestRef.current }];
      });

    checker.addListener('checkUpdate', handleCheckUpdate);

    const setCurrent = (id: StreamDiagnosticsEnum) => {
      currentTestRef.current = id;
      setCurrentTest(id);
    };

    logger.info('Starting diagnostics');

    runDiagnostics(diagnostics, isCanceledRef, setCurrent).finally(endCurrentDiagnostic);

    return () => {
      isCanceledRef.current = true;
      checker.removeListener('checkUpdate', handleCheckUpdate);
    };
  }, [
    audioOutputDiagnostic,
    endCurrentDiagnostic,
    isReadyToRun,
    screenSharingDiagnostic,
    tokens,
    videoOutputDiagnostic,
  ]);

  // NOTE: needed for restarting diagnostics
  useEffect(() => {
    if (!isDiagnosticsRunning) return;

    setResults([]);
    setCurrentTest(initialStreamDiagnosticTest);
    currentTestRef.current = initialStreamDiagnosticTest;
  }, [isDiagnosticsRunning]);

  useEffect(() => {
    if (isDiagnosticsRunning || !results) return;

    const diagnosticItems = getStreamDiagnosticsItems(t);
    const { criticalCount, warningCount } = getFailedTestsCount(results, diagnosticItems);
    const isSuccessful = !criticalCount && !warningCount;

    logger.info(`Diagnostics page results for stream, isSuccessful: ${isSuccessful}`, results);
  }, [isDiagnosticsRunning, results, t]);

  return { currentTest, results };
};

export default useStreamDiagnostics;
