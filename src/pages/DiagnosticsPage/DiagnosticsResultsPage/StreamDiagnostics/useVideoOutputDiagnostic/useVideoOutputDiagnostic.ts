import { Room } from 'livekit-client';
import { useCallback } from 'react';

import { isSafari } from 'utils/browsers';
import { SetState } from 'utils/types';

import { getDiagnosticsVideoElement, getDummyVideoTrack } from './utils';
import useAddStreamDiagnosticsResult from '../useAddStreamDiagnosticsResult';
import { CheckStatus, StreamDiagnosticsEnum, TestResult } from '../utils';

const defaultResultProperties = {
  id: StreamDiagnosticsEnum.VIDEO_OUTPUT,
  name: 'Video output check',
  description: 'Can receive and display video',
};

const useVideoOutputDiagnostic = (setResults: SetState<TestResult[]>, tokens?: string[]) => {
  const { addResult, addFailedResult } = useAddStreamDiagnosticsResult(setResults, defaultResultProperties);

  const runTest = useCallback(async () => {
    const room = new Room();
    const remoteRoom = new Room();

    if (!tokens || tokens.length < 2) return addFailedResult('Missing access tokens');

    await room.connect(import.meta.env.REACT_APP_LIVEKIT_SERVER_URL, tokens[0]).catch(addFailedResult);
    await remoteRoom.connect(import.meta.env.REACT_APP_LIVEKIT_SERVER_URL, tokens[1]).catch(addFailedResult);

    const dummyVideoTrack = getDummyVideoTrack();

    const handleCleanup = (message?: string) => {
      dummyVideoTrack.stop();
      room.disconnect();
      remoteRoom.disconnect();
      if (message) addFailedResult(message);
    };

    const localTrackPublication = remoteRoom.localParticipant.publishTrack(dummyVideoTrack).catch(handleCleanup);
    if (!localTrackPublication) return handleCleanup('Has no local track publication');

    //NOTE: need to wait until track is subscribed
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const remoteParticipant = room.getParticipantByIdentity(remoteRoom.localParticipant.identity);
    if (!remoteParticipant) return handleCleanup('Could not find a remote participant');

    const [remoteVideoPublication] = remoteParticipant.getTrackPublications();
    if (!remoteVideoPublication) return handleCleanup('Could not find a remote video publication');

    const remoteVideoTrack = remoteVideoPublication.videoTrack;
    if (!remoteVideoTrack) return handleCleanup('Could not find a remote video track');

    const { mediaStream } = remoteVideoTrack;
    if (!mediaStream) return handleCleanup('Remote video track has no mediaStream');

    // NOTE: videoElement starts to play immediately because of the autoplay attribute
    const videoElement = getDiagnosticsVideoElement(mediaStream);

    //NOTE: wait for a video to play
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (videoElement.paused) {
      // NOTE: safari sometimes seems to fail the autoplay
      if (isSafari) {
        addResult(CheckStatus.RUNNING, { level: 'info', message: 'Video was not able to autostart in safari' });
        videoElement.play().catch(handleCleanup);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (videoElement.paused) return handleCleanup('Video element is paused');
      } else return handleCleanup('Video element is paused');
    }
    if (videoElement.ended) return handleCleanup('Video element has ended');
    if (!videoElement.currentTime) return handleCleanup('Video element is not playing, it has no currentTime value');

    handleCleanup();
    addResult(CheckStatus.SUCCESS, { level: 'info', message: 'Success' });
  }, [addFailedResult, addResult, tokens]);

  return runTest;
};

export default useVideoOutputDiagnostic;
