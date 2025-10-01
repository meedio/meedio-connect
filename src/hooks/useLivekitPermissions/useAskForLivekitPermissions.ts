import { useCallback } from 'react';

import { DevicePermissionStatusEnum } from 'contexts/DevicePermissionsProvider/DevicePermissionsProvider';
import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import { USER_CHOICES } from 'contexts/VideoGridContext/layoutUtils';
import useLocalStorage from 'hooks/useLocalStorage/useLocalStorage';
import logger from 'utils/logging/faro';

import { askForPermissions } from './utils';

const useAskForLivekitPermissions = () => {
  const { setCameraPermissionStatus, setMicrophonePermissionStatus } = useDevicePermissionsContext();
  const [videoDeviceId] = useLocalStorage(USER_CHOICES.videoDeviceId, '');
  const [audioDeviceId] = useLocalStorage(USER_CHOICES.audioDeviceId, '');

  // NOTE: Create and stop tracks - this will ask for device permissions
  const askForBothPermissions = useCallback(
    async (shouldAskForCam: boolean, shouldAskForMic: boolean) => {
      const videoConstraint = videoDeviceId ? { deviceId: videoDeviceId } : true;
      const audioConstraint = audioDeviceId ? { deviceId: audioDeviceId } : true;

      const options = {
        video: shouldAskForCam ? videoConstraint : false,
        audio: shouldAskForMic ? audioConstraint : false,
      };

      const onSuccess = () => {
        logger.info('User has accepted media permissions prompt');
        if (shouldAskForCam) setCameraPermissionStatus(DevicePermissionStatusEnum.ALLOWED);
        if (shouldAskForMic) setMicrophonePermissionStatus(DevicePermissionStatusEnum.ALLOWED);
      };

      logger.info('Asking for both microphone and camera permissions', options);
      return askForPermissions({ options, onSuccess });
    },
    [audioDeviceId, setCameraPermissionStatus, setMicrophonePermissionStatus, videoDeviceId]
  );

  return { askForBothPermissions };
};

export default useAskForLivekitPermissions;
