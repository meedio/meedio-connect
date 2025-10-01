import { useModal } from '@ebay/nice-modal-react';
import { supportsScreenSharing } from '@livekit/components-core';
import { createLocalScreenTracks } from 'livekit-client';
import { SetStateAction, useCallback } from 'react';

import ScreenSharingDiagnosticModal from './ScreenSharingDiagnosticModal';
import useAddStreamDiagnosticsResult from '../useAddStreamDiagnosticsResult';
import { CheckStatus, StreamDiagnosticsEnum, TestResult } from '../utils';

const defaultResultProperties = {
  id: StreamDiagnosticsEnum.SCREEN_SHARING,
  name: 'Screen sharing check',
  description: 'Can share a screen',
};

const useScreenShareDiagnostic = (setResults: (value: SetStateAction<TestResult[]>) => void) => {
  const { show: displayModalAndWaitForConfirmation } = useModal(ScreenSharingDiagnosticModal);
  const { addResult, addFailedResult } = useAddStreamDiagnosticsResult(setResults, defaultResultProperties);

  const startScreenSharingDiagnostic = useCallback(
    () =>
      createLocalScreenTracks({ audio: false })
        .then(async (track) => {
          const [screenShareTrack] = track;
          if (!screenShareTrack) throw new Error('screenShareTrack is missing');

          const { mediaStreamTrack } = screenShareTrack;
          if (!mediaStreamTrack) throw new Error('mediaStreamTrack is missing');

          const { readyState } = mediaStreamTrack;
          if (readyState !== 'live') throw new Error(`mediaStreamTrack readyState is ${readyState}`);

          const { frameRate } = mediaStreamTrack.getSettings();
          if (!frameRate) throw new Error(`mediaStreamTrack framerate is ${frameRate}`);

          screenShareTrack.stop();
          addResult(CheckStatus.SUCCESS, {
            level: 'info',
            message: `Successfully created a track, frameRate - ${frameRate}`,
          });
        })
        .catch((error) => addFailedResult(typeof error === 'object' ? error.message : error)),
    [addFailedResult, addResult]
  );

  const handleScreenSharingDiagnostic = useCallback(() => {
    if (!supportsScreenSharing()) {
      return addFailedResult('Screen sharing is not supported');
    }

    return displayModalAndWaitForConfirmation()
      .then(startScreenSharingDiagnostic)
      .catch(() =>
        addResult(CheckStatus.SKIPPED, { level: 'info', message: 'Screen sharing was canceled by the user' })
      );
  }, [displayModalAndWaitForConfirmation, addFailedResult, addResult, startScreenSharingDiagnostic]);

  return handleScreenSharingDiagnostic;
};

export default useScreenShareDiagnostic;
