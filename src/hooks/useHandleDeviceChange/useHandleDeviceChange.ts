import { useMaybeRoomContext } from '@livekit/components-react';
import { ConnectionState, Track } from 'livekit-client';
import { logger } from 'matrix-js-sdk/src/logger';
import { useCallback, useEffect } from 'react';

import { DevicePermissionStatusEnum } from 'contexts/DevicePermissionsProvider/DevicePermissionsProvider';
import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { useTrackContext } from 'contexts/TrackContext/TrackContext';
import useEnumerateDevices from 'hooks/useEnumerateDevices/useEnumerateDevices';
import { MediaDeviceKind as MediaDeviceKindEnum } from 'utils/utils';

import { logDeviceListChange, UseHandleDeviceChangeProps } from './utils';

const useHandleDeviceChange = ({ kind, changeDevice }: UseHandleDeviceChangeProps) => {
  const { audioTrack: localAudioTrack } = useTrackContext();
  const { devicesRef, enumerateDevices, updateDevicesRef, getHasInputChanged } = useEnumerateDevices();
  const { audioDeviceId, videoDeviceId, setIsVideoEnabled, setIsAudioEnabled, setAudioDeviceId } =
    useLiveKitDevicesStateContext();
  const room = useMaybeRoomContext();
  const { setCameraPermissionStatus, setMicrophonePermissionStatus } = useDevicePermissionsContext();

  const isConnected =
    !!room &&
    [ConnectionState.Connected, ConnectionState.Reconnecting, ConnectionState.SignalReconnecting].includes(room.state);
  const audioTrack = isConnected
    ? room?.localParticipant.getTrackPublication(Track.Source.Microphone)?.audioTrack
    : localAudioTrack;
  const audioDeviceGroupId = audioTrack?.mediaStreamTrack.getSettings().groupId;
  const [activeDeviceId, setIsDeviceEnabled, setDevicePermissionStatus] =
    kind === 'audioinput'
      ? [audioDeviceId, setIsAudioEnabled, setMicrophonePermissionStatus]
      : [videoDeviceId, setIsVideoEnabled, setCameraPermissionStatus];

  const handleDeviceChange = useCallback(async () => {
    const devices = await enumerateDevices();
    const hasAudioInputChanged = getHasInputChanged(devices, MediaDeviceKindEnum.AUDIO_INPUT);
    const hasVideoInputChanged = getHasInputChanged(devices, MediaDeviceKindEnum.VIDEO_INPUT);
    const hasAudioOutputChanged = getHasInputChanged(devices, MediaDeviceKindEnum.AUDIO_OUTPUT);
    const mediaDevices = devices[kind];
    const currentDevice = activeDeviceId && mediaDevices.find(({ deviceId }) => deviceId === activeDeviceId);
    const defaultAudioDevice = mediaDevices.find(({ deviceId }) => deviceId === 'default');
    const defaultDeviceActual = mediaDevices.find(
      ({ groupId, deviceId }) => groupId === defaultAudioDevice?.groupId && deviceId !== 'default'
    );

    const updateToDefaultDevice = () =>
      changeDevice({
        deviceId: defaultDeviceActual?.deviceId || 'default',
        localDeviceId: 'default',
      });

    if (hasAudioInputChanged || hasVideoInputChanged) {
      //NOTE: allow permissions when previously there were no devices to trigger permission prompt
      if (!devicesRef.current[kind].length && mediaDevices.length) {
        logger.info('Allowing permissions when previously there were no devices to trigger permission prompt');
        setDevicePermissionStatus(DevicePermissionStatusEnum.ALLOWED);
      }
      //NOTE: handle switching from unplugged device to default or first device
      if (!currentDevice && mediaDevices.length) {
        if (defaultDeviceActual) {
          logger.info(`Switching from unplugged ${kind} device to default`);
          await updateToDefaultDevice();
        } else {
          logger.info(`Switching from unplugged ${kind} device to first device in the list`);
          const firstDeviceId = mediaDevices[0].deviceId;

          await changeDevice({
            deviceId: firstDeviceId,
            localDeviceId: firstDeviceId,
          });
        }
        //NOTE: After unplugging camera, for simplicity we set the local state to false to match the livekit internal state
        if (hasVideoInputChanged) setIsDeviceEnabled(false);
      }

      const isSwitchingFromDefaultToDefault =
        activeDeviceId === 'default' && !!defaultDeviceActual && defaultAudioDevice?.groupId !== audioDeviceGroupId;
      if (isSwitchingFromDefaultToDefault) {
        logger.info(`Switching from old default ${kind} device to new (current) default device`);
        await updateToDefaultDevice();
      }

      //NOTE: handle last device unplug
      if (!mediaDevices.length) {
        logger.info('Last device unplugged, setting local device enabled state to false');
        setIsDeviceEnabled(false);
        setDevicePermissionStatus(DevicePermissionStatusEnum.NO_DEVICE);
      }
    }

    const hasAudioOrVideoInputChanged =
      (kind === MediaDeviceKindEnum.VIDEO_INPUT && hasVideoInputChanged) ||
      (kind === MediaDeviceKindEnum.AUDIO_INPUT && hasAudioInputChanged);

    if (hasAudioOrVideoInputChanged) logDeviceListChange(kind, devices);
    if (hasAudioOutputChanged) logDeviceListChange(MediaDeviceKindEnum.AUDIO_OUTPUT, devices);

    updateDevicesRef(devices);
  }, [
    enumerateDevices,
    getHasInputChanged,
    kind,
    activeDeviceId,
    audioDeviceGroupId,
    updateDevicesRef,
    changeDevice,
    setIsDeviceEnabled,
    devicesRef,
    setDevicePermissionStatus,
  ]);

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [enumerateDevices, handleDeviceChange]);

  useEffect(() => {
    if (!room) return;

    const handleDeviceChange = (kind: MediaDeviceKind, newDeviceId: string) => {
      if (kind === 'audioinput' && audioDeviceId !== newDeviceId) {
        console.log('change device');
        setAudioDeviceId(newDeviceId);
      }
    };

    room.on('activeDeviceChanged', handleDeviceChange);

    return () => {
      room.off('activeDeviceChanged', handleDeviceChange);
    };
  }, [audioDeviceId, room, setAudioDeviceId]);
};

export default useHandleDeviceChange;
