import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';
import Tooltip from '@shared/components/Tooltip/Tooltip';
import cx from 'classnames';
import { HTMLAttributes } from 'react';

import ControlDropdownButton from 'components/ControlDropdownButton/ControlDropdownButton';
import Spinner from 'components/Spinner/Spinner';
import ToggleIcon from 'components/ToggleIcon/ToggleIcon';
import useTheme from 'hooks/useTheme';
import withClickLog from 'utils/logging/withClickLog';
import { IconType } from 'utils/types';

export interface ToggleAndDropdownButtonProps extends HTMLAttributes<HTMLButtonElement> {
  options: DropdownSelectionProps[];
  tooltipLabel: string;
  isActive: boolean;
  disabled: boolean;
  iconOn: IconType;
  iconOff: IconType;
  loading?: boolean;
  areDevicesBlocked?: boolean;
  isDisabledModalShown?: boolean;
  showModal: () => void;
}

const ToggleAndDropdownButton = ({
  options,
  tooltipLabel,
  isActive,
  onClick,
  disabled,
  iconOn: IconOn,
  iconOff: IconOff,
  loading = false,
  areDevicesBlocked = false,
  isDisabledModalShown = true,
  showModal,
  ...rest
}: ToggleAndDropdownButtonProps) => {
  const { isLightTheme, tooltipVariant } = useTheme();

  return (
    <Tooltip variant={tooltipVariant} label={tooltipLabel} placement="top" inGroup inPortal hoverDesktopOnly>
      <ControlDropdownButton
        options={options}
        isActive={isActive}
        onClick={onClick}
        loading={loading}
        openInPortal
        disabled={disabled || loading}
        className={cx({ 'hover:!bg-black5': isLightTheme && isActive })}
        isArrowHoverLight={isLightTheme}
        areDevicesBlocked={areDevicesBlocked}
        isDisabledModalShown={isDisabledModalShown}
        showModal={showModal}
        {...rest}
      >
        {loading ? (
          <Spinner size="xs" />
        ) : (
          <ToggleIcon
            isActive={isActive}
            onIcon={IconOn}
            offIcon={IconOff}
            className={cx('md:stroke-2.5 h-6 w-6 stroke-current stroke-2 pointer-events-none', {
              'text-gray-60 dark:text-white': isActive,
            })}
          />
        )}
      </ControlDropdownButton>
    </Tooltip>
  );
};

export default withClickLog(ToggleAndDropdownButton);
