import { useModal } from '@ebay/nice-modal-react';
import { useEffect, useRef } from 'react';

import { DevicePermissionStatusEnum } from 'contexts/DevicePermissionsProvider/DevicePermissionsProvider';
import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import CameraInUsePopup from 'modules/CameraInUsePopup/CameraInUsePopup';

import { CreateVideoTrack } from './useCreateLivekitTracks';

const useHandleCameraInUse = (createVideoTrack: CreateVideoTrack) => {
  const { cameraPermissionStatus } = useDevicePermissionsContext();
  const cameraInUsePopup = useModal(CameraInUsePopup);
  const isCameraInUsePopupShownOnceRef = useRef(false);

  useEffect(() => {
    const isCameraNotReadable = cameraPermissionStatus === DevicePermissionStatusEnum.NOT_READABLE;

    if (isCameraNotReadable && !cameraInUsePopup.visible && !isCameraInUsePopupShownOnceRef.current) {
      cameraInUsePopup.show({ onTryAgain: createVideoTrack });
      isCameraInUsePopupShownOnceRef.current = true;
    }
  }, [cameraInUsePopup, cameraPermissionStatus, createVideoTrack]);
};

export default useHandleCameraInUse;
