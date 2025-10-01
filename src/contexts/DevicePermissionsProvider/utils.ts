import { DevicePermissionStatusEnum } from './DevicePermissionsProvider';

export const isPermissionAllowed = (permissionStatus?: DevicePermissionStatusEnum) =>
  permissionStatus === DevicePermissionStatusEnum.ALLOWED;

export const isPermissionBlocked = (permissionStatus?: DevicePermissionStatusEnum) =>
  permissionStatus === DevicePermissionStatusEnum.BLOCKED;

export const isDeviceInaccessible = (permissionStatus?: DevicePermissionStatusEnum) => {
  const noAccessStatuses = [DevicePermissionStatusEnum.DENIED, DevicePermissionStatusEnum.NO_DEVICE];

  return !!permissionStatus && noAccessStatuses.includes(permissionStatus);
};
