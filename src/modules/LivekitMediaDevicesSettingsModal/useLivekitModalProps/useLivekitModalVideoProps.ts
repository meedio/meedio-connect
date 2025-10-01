import { LocalVideoTrack, Room } from 'livekit-client';
import { RefObject, useCallback } from 'react';

import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import useLivekitDeviceStatus from 'hooks/useLivekitDeviceStatus';
import useLivekitMediaDeviceToggle from 'hooks/useLivekitMediaDeviceToggle';
import useSfuPermissionsModal from 'hooks/useLivekitPermissions/useSfuPermissionsModal';

const kind = 'videoinput';

const useLivekitModalVideoProps = (videoTrack?: LocalVideoTrack, room?: Room) => {
  const { hasCameraPermissions } = useDevicePermissionsContext();
  const {
    options: videoOptions,
    isEnabled: isVideoEnabled,
    toggle,
  } = useLivekitMediaDeviceToggle({ kind, room, hasPermissions: hasCameraPermissions });
  const { areDevicesBlocked, isCameraInUse } = useLivekitDeviceStatus(kind);
  const showPermissionsModal = useSfuPermissionsModal(kind);

  const handleVideoChange = useCallback(
    (videoRef: RefObject<HTMLVideoElement>) => {
      if (videoRef.current && videoTrack) videoTrack.attach(videoRef.current);
    },
    [videoTrack]
  );

  const toggleCamera = videoOptions.length && !isCameraInUse && !areDevicesBlocked ? toggle : showPermissionsModal;

  const validVideoOptions = hasCameraPermissions ? videoOptions : [];

  return { videoOptions: validVideoOptions, isVideoEnabled, toggleCamera, handleVideoChange };
};

export default useLivekitModalVideoProps;
