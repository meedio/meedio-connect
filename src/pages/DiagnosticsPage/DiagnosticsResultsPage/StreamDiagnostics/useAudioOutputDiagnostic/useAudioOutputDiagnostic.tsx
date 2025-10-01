import { Room } from 'livekit-client';
import { useCallback } from 'react';

import useDiagnosticsStateContext from 'contexts/DiagnosticsStateProvider/useDiagnosticsStateContext';
import { isFirefox, isSafari } from 'utils/browsers';
import { SetState } from 'utils/types';

import { getDiagnosticAudioTrack } from './utils';
import useAddStreamDiagnosticsResult from '../useAddStreamDiagnosticsResult';
import { CheckStatus, StreamDiagnosticsEnum, TestResult } from '../utils';

const defaultResultProperties = {
  id: StreamDiagnosticsEnum.AUDIO_OUTPUT,
  name: 'Audio output check',
  description: 'Can receive and display audio',
};

const useAudioOutputDiagnostic = (setResults: SetState<TestResult[]>, tokens?: string[]) => {
  const { audioElementRef } = useDiagnosticsStateContext();
  const { addResult, addFailedResult } = useAddStreamDiagnosticsResult(setResults, defaultResultProperties);

  const runTest = useCallback(async () => {
    const audioElement = audioElementRef.current;
    if (!audioElement) return addFailedResult('There is no audio element to use');

    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioOutputDevices = devices.filter((device) => device.kind === 'audiooutput');

    // NOTE: firefox (older versions) and safari does not return any output devices
    if (isFirefox || isSafari) {
      const currentDeviceText = isFirefox ? 'User is using firefox' : 'User is using safari';
      addResult(CheckStatus.RUNNING, {
        level: 'info',
        message: `Could not determine if user has any output devices. ${currentDeviceText}`,
      });
    }

    if (!audioOutputDevices.length && !isFirefox && !isSafari) return addFailedResult('Has no output devices');

    const room = new Room();
    const remoteRoom = new Room();

    if (!tokens || tokens.length < 2) return addFailedResult('Missing access tokens');

    await room.connect(import.meta.env.REACT_APP_LIVEKIT_SERVER_URL, tokens[0]).catch(addFailedResult);
    await remoteRoom.connect(import.meta.env.REACT_APP_LIVEKIT_SERVER_URL, tokens[1]).catch(addFailedResult);

    const audioTrack = getDiagnosticAudioTrack();

    const handleCleanup = (message?: string) => {
      room.disconnect();
      remoteRoom.disconnect();
      if (audioTrack) audioTrack.stop();
      if (message) addFailedResult(message);
    };

    if (!audioTrack) return handleCleanup('No audio track was created');

    const localTrackPublication = remoteRoom.localParticipant.publishTrack(audioTrack).catch(handleCleanup);
    if (!localTrackPublication) return handleCleanup('Has no local track publication');

    //NOTE: need to wait until track is subscribed
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const remoteParticipant = room.getParticipantByIdentity(remoteRoom.localParticipant.identity);
    if (!remoteParticipant) return handleCleanup('Could not find a remote participant');

    const [remoteAudioPublication] = remoteParticipant.getTrackPublications();
    if (!remoteAudioPublication) return handleCleanup('Could not find a remote audio publication');

    const remoteAudioTrack = remoteAudioPublication.audioTrack;
    if (!remoteAudioTrack) return handleCleanup('Could not find a remote audio track');

    const { mediaStream } = remoteAudioTrack;
    if (!mediaStream) return handleCleanup('Remote audio track has no mediaStream');

    audioElement.srcObject = mediaStream;

    //NOTE: wait for an audio to play
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (audioElement.paused) return handleCleanup('Audio element is paused');
    if (audioElement.ended) return handleCleanup('Audio element has ended');
    if (!audioElement.currentTime) return handleCleanup('Audio element is not playing, it has no currentTime value');

    handleCleanup();
    addResult(CheckStatus.SUCCESS, { level: 'info', message: 'Success' });
  }, [addFailedResult, addResult, audioElementRef, tokens]);

  return runTest;
};

export default useAudioOutputDiagnostic;
