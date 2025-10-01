import { DeviceMapType } from 'hooks/useEnumerateDevices/useEnumerateDevices';
import logger from 'utils/logging/faro';

export type ChangeDeviceProps = {
  deviceId: string;
  localDeviceId?: string;
};

export type ChangeDevice = (changeDeviceProps: ChangeDeviceProps) => Promise<void>;

export interface UseHandleDeviceChangeProps {
  kind: MediaDeviceKind;
  changeDevice: ChangeDevice;
}

export const logDeviceListChange = (deviceKind: MediaDeviceKind, devices: DeviceMapType) =>
  logger.info(`Device list changed of kind: ${deviceKind}`, [devices[deviceKind]]);
