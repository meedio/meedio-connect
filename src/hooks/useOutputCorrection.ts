import { useConnectionState, useMediaDeviceSelect, useRoomContext } from '@livekit/components-react';
import { useCallback, useEffect, useRef } from 'react';

import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { hasSupportSetSinkId } from 'modules/MediaDevicesSettings/utils';
import { isFirefox } from 'utils/browsers';
import logger from 'utils/logging/faro';
import { MediaDeviceKind, getIsConnectedToSfu } from 'utils/utils';

const useOutputCorrection = () => {
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const { audioOutputId, setAudioOutputId } = useLiveKitDevicesStateContext();
  const { setActiveMediaDevice, activeDeviceId, devices } = useMediaDeviceSelect({
    kind: MediaDeviceKind.AUDIO_OUTPUT,
    room,
    requestPermissions: false,
  });
  const isAudioCorrectionCompletedRef = useRef(false);
  const defaultDeviceGroupIdRef = useRef<string>();

  const isConnected = getIsConnectedToSfu(connectionState);

  // NOTE: initial audio output correction
  useEffect(() => {
    if (isAudioCorrectionCompletedRef.current || !isConnected || !hasSupportSetSinkId) return;

    const isCorrectDeviceSelected = audioOutputId === activeDeviceId;
    if (isCorrectDeviceSelected) {
      isAudioCorrectionCompletedRef.current = true;
      return;
    }

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const outputDevices = devices.filter(({ kind }) => kind === MediaDeviceKind.AUDIO_OUTPUT);
      const hasSavedDevice = outputDevices.some(({ deviceId }) => deviceId === audioOutputId);

      if (hasSavedDevice) setActiveMediaDevice(audioOutputId);
      else setAudioOutputId(activeDeviceId);
      logger.info('Initial audio output correction');

      isAudioCorrectionCompletedRef.current = true;
    });
  }, [activeDeviceId, audioOutputId, devices, isConnected, setActiveMediaDevice, setAudioOutputId]);

  const handleAudioOutputDisconnect = useCallback(async () => {
    const audioOutputDevices = (await navigator.mediaDevices.enumerateDevices()).filter(
      ({ kind }) => kind === MediaDeviceKind.AUDIO_OUTPUT
    );

    if (!audioOutputDevices.length) return;

    const defaultDevice = audioOutputDevices.find(({ deviceId }) => deviceId === 'default');
    const hasCurrentlyActiveOutput = audioOutputDevices.some(({ deviceId }) => deviceId === audioOutputId);
    const newDeviceId = defaultDevice ? 'default' : audioOutputDevices[0].deviceId;
    const isDefaultToDefaultChange =
      audioOutputId === 'default' && defaultDevice?.groupId !== defaultDeviceGroupIdRef.current;

    if (defaultDevice) defaultDeviceGroupIdRef.current = defaultDevice.groupId;
    //NOTE: because firefox doesn't have a way to identify the "default" device, we always change to the new device
    if (!hasCurrentlyActiveOutput || isDefaultToDefaultChange || isFirefox) {
      logger.info(`Changing audio output in useLivekitOutputCorrection to id: ${newDeviceId}`);
      setActiveMediaDevice(newDeviceId).then(() => setAudioOutputId(newDeviceId));
    }
  }, [audioOutputId, setActiveMediaDevice, setAudioOutputId]);

  useEffect(() => {
    if (!hasSupportSetSinkId) return;

    navigator.mediaDevices.addEventListener('devicechange', handleAudioOutputDisconnect);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleAudioOutputDisconnect);
    };
  }, [handleAudioOutputDisconnect]);
};

export default useOutputCorrection;
