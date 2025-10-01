import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';

const useLivekitDeviceStatus = (kind: MediaDeviceKind) => {
  const {
    isCameraBlocked,
    isMicrophoneBlocked,
    hasCameraPermissions,
    hasMicrophonePermissions,
    isCameraInUse,
    hasNoCameraDevice,
    hasNoMicrophoneDevice,
  } = useDevicePermissionsContext();

  const isVideoInput = kind === 'videoinput';
  const [areDevicesBlocked, hasPermissions, hasNoDevice] = isVideoInput
    ? [isCameraBlocked, hasCameraPermissions, hasNoCameraDevice]
    : [isMicrophoneBlocked, hasMicrophonePermissions, hasNoMicrophoneDevice];

  const isDeviceActive = isVideoInput
    ? !isCameraBlocked && hasCameraPermissions
    : !isMicrophoneBlocked && hasMicrophonePermissions;

  return {
    areDevicesBlocked,
    hasPermissions,
    isDeviceActive,
    isCameraInUse: isVideoInput && isCameraInUse,
    hasNoDevice,
  };
};

export default useLivekitDeviceStatus;
