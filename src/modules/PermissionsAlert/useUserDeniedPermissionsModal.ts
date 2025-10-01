import { useModal } from '@ebay/nice-modal-react';
import { useEffect, useRef } from 'react';

import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import { isDeviceInaccessible } from 'contexts/DevicePermissionsProvider/utils';

import PermissionsAlert from './PermissionsAlert';

const useUserDeniedPermissionsModal = () => {
  const { show, remove, visible } = useModal(PermissionsAlert);
  const { cameraPermissionStatus, microphonePermissionStatus } = useDevicePermissionsContext();
  const hasShownModalRef = useRef(false);

  useEffect(() => {
    if (
      isDeviceInaccessible(cameraPermissionStatus) &&
      isDeviceInaccessible(microphonePermissionStatus) &&
      !hasShownModalRef.current
    ) {
      if (!visible) show({ onContinueWithoutDevices: remove });

      hasShownModalRef.current = true;
    }
  }, [cameraPermissionStatus, microphonePermissionStatus, remove, show, visible]);
};

export default useUserDeniedPermissionsModal;
