import { createContext, PropsWithChildren, useState } from 'react';

import { SetState } from 'utils/types';

import { isPermissionAllowed, isPermissionBlocked } from './utils';

export enum DevicePermissionStatusEnum {
  ALLOWED = 'allowed',
  DENIED = 'denied',
  BLOCKED = 'blocked',
  NOT_READABLE = 'not_readable',
  NO_DEVICE = 'no_device',
}

type DevicePermissionsContextType = {
  hasCameraPermissions: boolean;
  isCameraBlocked: boolean;
  cameraPermissionStatus?: DevicePermissionStatusEnum;
  hasMicrophonePermissions: boolean;
  isMicrophoneBlocked: boolean;
  microphonePermissionStatus?: DevicePermissionStatusEnum;
  setCameraPermissionStatus: SetState<DevicePermissionStatusEnum | undefined>;
  setMicrophonePermissionStatus: SetState<DevicePermissionStatusEnum | undefined>;
  isCameraInUse: boolean;
  hasNoCameraDevice: boolean;
  hasNoMicrophoneDevice: boolean;
};

export const DevicePermissionsContext = createContext<DevicePermissionsContextType | null>(null);

const DevicePermissionsProvider = ({ children }: PropsWithChildren) => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<DevicePermissionStatusEnum>();
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState<DevicePermissionStatusEnum>();

  const hasCameraPermissions = isPermissionAllowed(cameraPermissionStatus);
  const hasMicrophonePermissions = isPermissionAllowed(microphonePermissionStatus);
  const isCameraBlocked = isPermissionBlocked(cameraPermissionStatus);
  const isMicrophoneBlocked = isPermissionBlocked(microphonePermissionStatus);
  const isCameraInUse = cameraPermissionStatus === DevicePermissionStatusEnum.NOT_READABLE;
  const hasNoCameraDevice = cameraPermissionStatus === DevicePermissionStatusEnum.NO_DEVICE;
  const hasNoMicrophoneDevice = microphonePermissionStatus === DevicePermissionStatusEnum.NO_DEVICE;

  return (
    <DevicePermissionsContext.Provider
      value={{
        hasCameraPermissions,
        isCameraBlocked,
        cameraPermissionStatus,
        hasMicrophonePermissions,
        isMicrophoneBlocked,
        microphonePermissionStatus,
        setCameraPermissionStatus,
        setMicrophonePermissionStatus,
        isCameraInUse,
        hasNoCameraDevice,
        hasNoMicrophoneDevice,
      }}
    >
      {children}
    </DevicePermissionsContext.Provider>
  );
};

export default DevicePermissionsProvider;
