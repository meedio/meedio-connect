import { useModal } from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';

import { DevicePermissionStatusEnum } from 'contexts/DevicePermissionsProvider/DevicePermissionsProvider';
import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useCreateLivekitTracks from 'hooks/useCreateLivekitTracks/useCreateLivekitTracks';
import useHandleCameraInUse from 'hooks/useCreateLivekitTracks/useHandleCameraInUse';
import { checkCameraPermissions, checkMicrophonePermissions } from 'hooks/usePermissionsModal/utils';
import useUserDeniedPermissionsModal from 'modules/PermissionsAlert/useUserDeniedPermissionsModal';
import RequestPermissionsPopup from 'modules/RequestPermissionsPopup/RequestPermissionsPopup';
import WaitingForPermissionsModal from 'modules/WaitingForPermissionsModal/WaitingForPermissionsModal';
import { getIsMobile, isFirefox, isPermissionsApiSupported } from 'utils/browsers';
import logger from 'utils/logging/faro';

import useAskForLivekitPermissions from './useAskForLivekitPermissions';

const useLivekitPermissions = (isReadyToCheckPermissions = true) => {
  const requestPermissionsPopup = useModal(RequestPermissionsPopup);
  const waitingForPermissionsModal = useModal(WaitingForPermissionsModal);
  const [isPermitted, setIsPermitted] = useState(false);
  const [isPermissionsChecked, setIsPermissionsChecked] = useState(false);
  const { askForBothPermissions } = useAskForLivekitPermissions();
  const { setCameraPermissionStatus, setMicrophonePermissionStatus } = useDevicePermissionsContext();
  const { createVideoTrack, createAudioTrack } = useCreateLivekitTracks();
  const { isVideoEnabled } = useLiveKitDevicesStateContext();
  useUserDeniedPermissionsModal();
  useHandleCameraInUse(createVideoTrack);

  const updateUIAndAskForPermissions = useCallback(
    async (hasCam: boolean, hasMic: boolean) => {
      if (requestPermissionsPopup.visible) requestPermissionsPopup.remove();
      waitingForPermissionsModal.show();

      //NOTE: mobile firefox queries all the cameras when the video constraint is "true", resulting in many permission prompts (accept/deny)
      const isMobileFirefox = isFirefox && getIsMobile();

      if (!isMobileFirefox) await askForBothPermissions(hasCam, hasMic);

      if (hasMic) await createAudioTrack();
      if (hasCam) await createVideoTrack();

      waitingForPermissionsModal.remove();
      setIsPermitted(true);
    },
    [requestPermissionsPopup, waitingForPermissionsModal, askForBothPermissions, createAudioTrack, createVideoTrack]
  );

  const checkPermissions = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameraDevices = devices.filter(({ kind }) => kind === 'videoinput');
    const micDevices = devices.filter(({ kind }) => kind === 'audioinput');
    const hasCam = cameraDevices.length > 0;
    const hasMic = micDevices.length > 0;
    const hasCamLabel = !!cameraDevices[0]?.label;
    const hasMicLabel = !!micDevices[0]?.label;
    const hasNoDevices = !hasCam && !hasMic;

    //NOTE: no camera and microphone device cases
    if (!hasCam) setCameraPermissionStatus(DevicePermissionStatusEnum.NO_DEVICE);
    if (!hasMic) setMicrophonePermissionStatus(DevicePermissionStatusEnum.NO_DEVICE);

    if (!isFirefox && isPermissionsApiSupported) {
      const isCamPermissionsDenied = (await checkCameraPermissions()).state === 'denied';
      const isMicPermissionsDenied = (await checkMicrophonePermissions()).state === 'denied';

      const hasBothDevicesDenied = hasCam && hasMic && isCamPermissionsDenied && isMicPermissionsDenied;
      const hasOnlyCamAndDenied = hasCam && !hasMic && isCamPermissionsDenied;
      const hasOnlyMicAndDenied = hasMic && !hasCam && isMicPermissionsDenied;

      if (hasOnlyCamAndDenied) setCameraPermissionStatus(DevicePermissionStatusEnum.DENIED);
      if (hasOnlyMicAndDenied) setMicrophonePermissionStatus(DevicePermissionStatusEnum.DENIED);

      // Participant has no accessible devices
      if (hasBothDevicesDenied || hasOnlyCamAndDenied || hasOnlyMicAndDenied) return setIsPermitted(true);
    }

    // NOTE: Create tracks and check permission if already gave permissions or has no devices
    if (hasNoDevices || hasCamLabel || hasMicLabel) {
      if (!hasNoDevices) {
        if (hasMic) createAudioTrack();

        if (hasCam) {
          if (isVideoEnabled) await createVideoTrack();
          //NOTE: handle case when person has local storage value livekit_videoinput as false (turned off camera previously).
          else {
            logger.info('setting cameraPermissionStatus to allowed, because user turned off camera previously');
            setCameraPermissionStatus(DevicePermissionStatusEnum.ALLOWED);
          }
        }
      } else {
        logger.info('User has no microphone or camera devices');
      }

      return setIsPermitted(true);
    }

    requestPermissionsPopup.show({ onRequestPermissions: () => updateUIAndAskForPermissions(hasCam, hasMic) });
  }, [
    createAudioTrack,
    createVideoTrack,
    isVideoEnabled,
    requestPermissionsPopup,
    setCameraPermissionStatus,
    setMicrophonePermissionStatus,
    updateUIAndAskForPermissions,
  ]);

  // NOTE: initial permissions check
  useEffect(() => {
    if (!isPermissionsChecked && isReadyToCheckPermissions) {
      setIsPermissionsChecked(true);
      checkPermissions();
    }
  }, [checkPermissions, isReadyToCheckPermissions, isPermissionsChecked]);

  return { isPermitted, isPermissionsChecked };
};

export default useLivekitPermissions;
