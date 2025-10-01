import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import ControlDropdownButton from 'components/ControlDropdownButton/ControlDropdownButton';
import ToggleIcon from 'components/ToggleIcon/ToggleIcon';
import useHandleDeviceChange from 'hooks/useHandleDeviceChange/useHandleDeviceChange';
import useLivekitDeviceStatus from 'hooks/useLivekitDeviceStatus';
import useLivekitMediaDeviceToggle from 'hooks/useLivekitMediaDeviceToggle';
import useSfuPermissionsModal from 'hooks/useLivekitPermissions/useSfuPermissionsModal';
import { IconType } from 'utils/types';

export const controlIconStyle = 'w-6 h-6 stroke-current stroke-2 md:stroke-2.5';

interface LivekitTrackToggleProps {
  kind: MediaDeviceKind;
  onIcon: IconType;
  offIcon: IconType;
  dataTestId?: string;
  disabled?: boolean;
  onClick?: () => void;
}

function LivekitTrackToggle({
  kind,
  onIcon: OnIcon,
  offIcon: OffIcon,
  dataTestId,
  disabled,
  onClick,
}: LivekitTrackToggleProps) {
  const { t } = useTranslation();
  const { areDevicesBlocked, hasPermissions, isDeviceActive } = useLivekitDeviceStatus(kind);
  const { options, isEnabled, toggle, changeDevice } = useLivekitMediaDeviceToggle({ kind, hasPermissions });
  useHandleDeviceChange({ kind, changeDevice });
  const showPermissionsModal = useSfuPermissionsModal(kind);

  const ariaLabelText = kind === 'videoinput' ? t('toggle_camera') : t('toggle_microphone');
  const isActive = isEnabled && isDeviceActive && !disabled;
  const areDevicesDisabled = !options.length || areDevicesBlocked || disabled;

  const handleClick = () => {
    if (onClick) onClick();
    toggle();
  };

  return (
    <ControlDropdownButton
      disabled={areDevicesDisabled}
      options={options}
      isActive={isEnabled}
      onClick={handleClick}
      arrowClassName="!text-white70"
      data-testid={dataTestId}
      aria-label={ariaLabelText}
      aria-pressed={isEnabled}
      areDevicesBlocked={areDevicesBlocked}
      showModal={showPermissionsModal}
      isDisabledModalShown={areDevicesDisabled}
      openInPortal
    >
      <ToggleIcon
        onIcon={OnIcon}
        offIcon={OffIcon}
        isActive={isActive}
        className={cx(controlIconStyle, { 'text-white': isActive })}
      />
    </ControlDropdownButton>
  );
}

export default LivekitTrackToggle;
