import { isPermissionsApiSupported } from 'utils/browsers';
import { SetState } from 'utils/types';

export type IPermissionStatus = PermissionState | 'unsupported' | 'loading' | 'without_devices' | 'system_blocked';
export enum PermissionStatusEnum {
  ALERT,
  POPUP,
  WITHOUT_DEVICES,
  SYSTEM_BLOCKED,
  NOT_READABLE,
}

export interface PermissionsHookResult {
  status?: PermissionStatusEnum;
  setStatus: SetState<PermissionStatusEnum | undefined>;
  hasPromptedPermissions: boolean;
  shouldRequestPermissions: boolean;
  requestPermissions: () => void;
}

export const checkMicrophonePermissions = () => navigator.permissions.query({ name: 'microphone' as PermissionName });
export const checkCameraPermissions = () => navigator.permissions.query({ name: 'camera' as PermissionName });

export const defaultPermissionState: IPermissionStatus = isPermissionsApiSupported ? 'loading' : 'unsupported';

export const getStatus = (status: IPermissionStatus) => {
  if (status === 'prompt') return PermissionStatusEnum.POPUP;
  if (status === 'denied') return PermissionStatusEnum.ALERT;
  if (status === 'without_devices') return PermissionStatusEnum.WITHOUT_DEVICES;
  if (status === 'system_blocked') return PermissionStatusEnum.SYSTEM_BLOCKED;
  if (status === 'granted') return;
};
