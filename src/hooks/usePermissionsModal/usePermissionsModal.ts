import { useModal } from '@ebay/nice-modal-react';

import { CreateVideoTrack } from 'hooks/useCreateLivekitTracks/useCreateLivekitTracks';
import BlockedPermissionsPopup from 'modules/BlockedPermissionsPopup/BlockedPermissionsPopup';
import CameraInUsePopup from 'modules/CameraInUsePopup/CameraInUsePopup';
import NoDeviceModal from 'modules/NoDeviceModal/NoDeviceModal';
import NoPermissionsModal from 'modules/NoPermissionsModal/NoPermissionsModal';

interface UseShowPermissionsModalProps {
  areDevicesBlocked: boolean;
  isCameraInUse?: boolean;
  onTryAgain?: CreateVideoTrack;
  hasNoDevice: boolean;
  kind: MediaDeviceKind;
}

const useShowPermissionsModal = ({
  areDevicesBlocked,
  isCameraInUse = false,
  onTryAgain,
  hasNoDevice,
  kind,
}: UseShowPermissionsModalProps) => {
  const noPermissionsModal = useModal(NoPermissionsModal);
  const blockedPermissionsPopup = useModal(BlockedPermissionsPopup);
  const cameraInUsePopup = useModal(CameraInUsePopup);
  const noDeviceModal = useModal(NoDeviceModal);

  const showPermissionsModal = () => {
    if (isCameraInUse) return cameraInUsePopup.show({ onTryAgain });
    if (areDevicesBlocked) return blockedPermissionsPopup.show();
    if (hasNoDevice) return noDeviceModal.show({ kind });

    noPermissionsModal.show();
  };

  return showPermissionsModal;
};

export default useShowPermissionsModal;
