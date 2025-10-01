import { ToggleSource } from '@livekit/components-core';
import { useMediaDeviceSelect, useTrackToggle } from '@livekit/components-react';
import { ConnectionState, Room, Track } from 'livekit-client';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Alert } from 'assets/icons/Alert.svg';
import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useToast from 'contexts/ToastProvider/useToast';
import { useTrackContext } from 'contexts/TrackContext/TrackContext';
import logger from 'utils/logging/faro';

import useCreateLivekitTracks from './useCreateLivekitTracks/useCreateLivekitTracks';
import { getOptions } from './useDeviceOptions/toggleDevices';
import { ChangeDeviceProps } from './useHandleDeviceChange/utils';
interface UseLivekitMediaDeviceToggleProps {
  kind: MediaDeviceKind;
  room?: Room;
  hasPermissions?: boolean;
}

const useLivekitMediaDeviceToggle = ({ kind, room, hasPermissions = false }: UseLivekitMediaDeviceToggleProps) => {
  const { t } = useTranslation();
  const { createVideoTrack, createAudioTrack } = useCreateLivekitTracks();
  const { removeVideoTrack } = useTrackContext();
  const { pushToast } = useToast();
  const {
    audioDeviceId,
    videoDeviceId,
    setVideoDeviceId,
    setAudioDeviceId,
    isAudioEnabled,
    setIsAudioEnabled,
    isVideoEnabled,
    setIsVideoEnabled,
    isVideoLoading,
    setIsVideoLoading,
    isAudioLoading,
    setIsAudioLoading,
  } = useLiveKitDevicesStateContext();
  const { devices, setActiveMediaDevice } = useMediaDeviceSelect({ kind, room, requestPermissions: hasPermissions });

  const [isDeviceEnabled, setIsDeviceEnabled] =
    kind === 'videoinput' ? [isVideoEnabled, setIsVideoEnabled] : [isAudioEnabled, setIsAudioEnabled];
  const [activeDeviceId, setActiveDeviceId, isLoading, setIsLoading, deviceSource, createTrack] =
    kind === 'videoinput'
      ? [
          videoDeviceId,
          setVideoDeviceId,
          isVideoLoading,
          setIsVideoLoading,
          Track.Source.Camera as ToggleSource,
          isVideoEnabled ? createVideoTrack : null,
        ]
      : [
          audioDeviceId,
          setAudioDeviceId,
          isAudioLoading,
          setIsAudioLoading,
          Track.Source.Microphone as ToggleSource,
          createAudioTrack,
        ];

  // NOTE: needed for livekit to stop calling getUserMedia without permissions
  const source = hasPermissions ? deviceSource : (Track.Source.Unknown as ToggleSource);

  const { toggle: toggleDevice, track } = useTrackToggle({
    source,
    captureOptions: { deviceId: activeDeviceId },
  });

  const isConnected =
    !!room &&
    [ConnectionState.Connected, ConnectionState.Reconnecting, ConnectionState.SignalReconnecting].includes(room.state);
  const isConnecting = ConnectionState.Connecting === room?.state;
  const isToggleDisabled = isConnecting || !!(isConnected && !track && isDeviceEnabled);

  const updateDeviceState = useCallback(
    async (deviceState: boolean) => {
      logger.info('Updating device state to value:', { kind, deviceState });
      // NOTE: we should toggle livekit state only if user is connected
      if (isConnected) {
        setIsLoading(true);
        toggleDevice(deviceState)
          .then(() => setIsDeviceEnabled(deviceState))
          .finally(() => setIsLoading(false))
          .catch((e) => {
            pushToast({
              variant: 'info',
              icon: Alert,
              title: t('something_wrong'),
              description: kind === 'videoinput' ? t('toggle_camera_error') : t('toggle_microphone_error'),
            });

            logger.error('Failed to update device state', { kind, e });
          });
      } else {
        setIsDeviceEnabled(deviceState);

        if (kind === 'videoinput') {
          if (deviceState) {
            createVideoTrack();
            return;
          }

          removeVideoTrack();
        }
      }
    },
    [
      createVideoTrack,
      isConnected,
      kind,
      pushToast,
      removeVideoTrack,
      setIsDeviceEnabled,
      setIsLoading,
      t,
      toggleDevice,
    ]
  );

  const filteredDevices = useMemo(() => devices.filter(({ label }) => !!label), [devices]);

  const changeDevice = useCallback(
    async ({ deviceId, localDeviceId }: ChangeDeviceProps) => {
      setActiveDeviceId(localDeviceId || deviceId);

      if (!isConnected && createTrack) await createTrack(deviceId);

      // NOTE: we should change device in livekit only if user is connected
      if (isConnected) {
        setIsLoading(true);
        await setActiveMediaDevice(deviceId, { exact: true })
          .catch(() => {
            logger.warn('Failed to change device', { deviceSource, deviceId, localDeviceId });
            pushToast({ variant: 'info', icon: Alert, title: t('could_not_change_device') });
          })
          .finally(() => setIsLoading(false));
      }
    },
    [createTrack, deviceSource, isConnected, pushToast, setActiveDeviceId, setActiveMediaDevice, setIsLoading, t]
  );

  const options = getOptions(filteredDevices, changeDevice, activeDeviceId);

  const toggle = () => updateDeviceState(!isDeviceEnabled);

  return {
    options,
    loading: isLoading,
    devices: filteredDevices,
    activeDeviceId,
    isEnabled: isDeviceEnabled,
    toggle,
    isToggleDisabled,
    track,
    changeDevice,
  };
};

export default useLivekitMediaDeviceToggle;
