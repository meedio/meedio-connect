import { useRoomContext } from '@livekit/components-react';

import useHandleDeviceChange from 'hooks/useHandleDeviceChange/useHandleDeviceChange';
import useLivekitDeviceStatus from 'hooks/useLivekitDeviceStatus';
import useLivekitMediaDeviceToggle from 'hooks/useLivekitMediaDeviceToggle';
import useSfuPermissionsModal from 'hooks/useLivekitPermissions/useSfuPermissionsModal';

import ToggleAndDropdownButton, { ToggleAndDropdownButtonProps } from './ToggleAndDropdownButton';

interface DeviceControlProps extends Pick<ToggleAndDropdownButtonProps, 'iconOn' | 'iconOff'> {
  kind: MediaDeviceKind;
  tooltipLabel: string;
  disabled?: boolean;
}

const DeviceControl = ({ kind, tooltipLabel, iconOff, iconOn, disabled }: DeviceControlProps) => {
  const room = useRoomContext();
  const { areDevicesBlocked, hasPermissions, isDeviceActive } = useLivekitDeviceStatus(kind);
  const { options, loading, devices, isEnabled, toggle, isToggleDisabled, changeDevice } = useLivekitMediaDeviceToggle({
    kind,
    hasPermissions,
    room,
  });
  const showPermissionsModal = useSfuPermissionsModal(kind);
  useHandleDeviceChange({ kind, changeDevice });

  const isActive = isEnabled && isDeviceActive && !disabled;
  const areDevicesDisabled = !devices.length || areDevicesBlocked || disabled;

  return (
    <ToggleAndDropdownButton
      options={options}
      tooltipLabel={tooltipLabel}
      isActive={isActive}
      loading={loading}
      onClick={toggle}
      disabled={areDevicesDisabled || isToggleDisabled}
      iconOn={iconOn}
      iconOff={iconOff}
      aria-pressed={isEnabled}
      areDevicesBlocked={areDevicesBlocked}
      showModal={showPermissionsModal}
      isDisabledModalShown={areDevicesDisabled}
    />
  );
};

export default DeviceControl;
