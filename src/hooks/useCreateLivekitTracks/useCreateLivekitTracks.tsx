import { useModal } from '@ebay/nice-modal-react';
import { createLocalAudioTrack, createLocalVideoTrack, LocalVideoTrack } from 'livekit-client';
import { useCallback } from 'react';

import { DevicePermissionStatusEnum } from 'contexts/DevicePermissionsProvider/DevicePermissionsProvider';
import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { useTrackContext } from 'contexts/TrackContext/TrackContext';
import useIsMounted from 'hooks/useIsMounted';
import BlockedPermissionsPopup from 'modules/BlockedPermissionsPopup/BlockedPermissionsPopup';
import logger from 'utils/logging/faro';
import { SetState } from 'utils/types';
import { getIsDeviceBlockedBySystem, getIsCameraInUse, getIsPermissionsDeniedByUser } from 'utils/utils';

import useInitializeDeviceIds from './useInitializeDeviceIds';

export type CreateVideoTrack = (deviceId?: string) => Promise<void | LocalVideoTrack>;

const useCreateLivekitTracks = () => {
  const { videoDeviceId, audioDeviceId } = useLiveKitDevicesStateContext();
  const { audioTrack, setAudioTrack, videoTrack, setVideoTrack } = useTrackContext();
  const { setCameraPermissionStatus, setMicrophonePermissionStatus } = useDevicePermissionsContext();
  const blockedPermissionsPopup = useModal(BlockedPermissionsPopup);
  useInitializeDeviceIds({ audioTrack, videoTrack });
  const isMounted = useIsMounted();

  const handleFail = useCallback(
    (setPermissionStatus: SetState<DevicePermissionStatusEnum | undefined>, error: Error) => {
      if (getIsDeviceBlockedBySystem(error)) {
        logger.warn('Could not create track: Device is blocked by system', error);
        if (!blockedPermissionsPopup.visible) blockedPermissionsPopup.show();

        return setPermissionStatus(DevicePermissionStatusEnum.BLOCKED);
      }
      if (getIsCameraInUse(error)) {
        logger.warn('Could not create track: Camera is in use', error);
        return setPermissionStatus(DevicePermissionStatusEnum.NOT_READABLE);
      }
      if (getIsPermissionsDeniedByUser(error)) {
        logger.warn('Could not create track: Permission is denied by user', error);
        return setPermissionStatus(DevicePermissionStatusEnum.DENIED);
      }
    },
    [blockedPermissionsPopup]
  );

  const createVideoTrack: CreateVideoTrack = useCallback(
    async (deviceId?: string) => {
      const videoConstraint = deviceId || videoDeviceId ? { deviceId: deviceId || videoDeviceId } : undefined;
      logger.info('Creating video track', { videoConstraint });

      if (videoTrack) videoTrack.stop();

      return createLocalVideoTrack(videoConstraint)
        .then((videoTrack) => {
          if (!isMounted()) return videoTrack.stop();
          setCameraPermissionStatus(DevicePermissionStatusEnum.ALLOWED);
          setVideoTrack(videoTrack);
          logger.info('video track created', { videoTrack, videoConstraint });

          return videoTrack;
        })
        .catch((e) => handleFail(setCameraPermissionStatus, e));
    },
    [handleFail, isMounted, setCameraPermissionStatus, setVideoTrack, videoDeviceId, videoTrack]
  );

  const createAudioTrack = useCallback(
    async (deviceId?: string) => {
      const audioConstraint =
        deviceId || audioDeviceId ? { deviceId: deviceId || audioDeviceId } : { deviceId: 'default' };
      logger.info('Creating audio track', { audioConstraint });

      if (audioTrack) audioTrack.stop();

      return createLocalAudioTrack(audioConstraint)
        .then((audioTrack) => {
          setMicrophonePermissionStatus(DevicePermissionStatusEnum.ALLOWED);
          setAudioTrack(audioTrack);
          logger.info('audio track created', { audioTrack, audioConstraint });

          return audioTrack;
        })
        .catch((e) => handleFail(setMicrophonePermissionStatus, e));
    },
    [audioDeviceId, audioTrack, handleFail, setAudioTrack, setMicrophonePermissionStatus]
  );

  return { createAudioTrack, createVideoTrack };
};

export default useCreateLivekitTracks;
