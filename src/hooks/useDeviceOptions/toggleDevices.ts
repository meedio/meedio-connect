import { ChangeDevice } from 'hooks/useHandleDeviceChange/utils';

export const getOptions = (inputs: MediaDeviceInfo[], onClick: ChangeDevice, inputDeviceId: string) =>
  inputs.map(({ label: title, deviceId }) => ({
    title,
    onClick: () => onClick({ deviceId }),
    isSelected: inputDeviceId === deviceId,
  }));
