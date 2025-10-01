import { Placement } from '@floating-ui/react-dom-interactions';
import ControlButton, { ControlButtonVariant } from '@shared/components/ControlButton/ControlButton';
import Tooltip, { TooltipType } from '@shared/components/Tooltip/Tooltip';
import cx from 'classnames';
import { HTMLAttributes } from 'react';

import Spinner from 'components/Spinner/Spinner';
import useTheme from 'hooks/useTheme';
import withClickLog from 'utils/logging/withClickLog';
import { IconType } from 'utils/types';

interface FooterButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: ControlButtonVariant;
  disabled?: boolean;
  icon: IconType;
  tooltipLabel: string;
  tooltipPlacement?: Placement;
  isLoading?: boolean;
  isActive?: boolean;
  tooltipType?: TooltipType;
  iconClassName?: string;
  badgeValue?: number;
  hasNotificationBubble?: boolean;
  wrapperClassName?: string;
}

const FooterButton = ({
  variant = 'contrastSecondary',
  disabled,
  icon: Icon,
  tooltipLabel,
  tooltipPlacement,
  isLoading = false,
  isActive = false,
  tooltipType = 'hover',
  iconClassName,
  className,
  badgeValue,
  hasNotificationBubble,
  wrapperClassName,
  ...rest
}: FooterButtonProps) => {
  const { isLightTheme, tooltipVariant } = useTheme();

  return (
    <Tooltip
      variant={tooltipVariant}
      label={tooltipLabel}
      placement={tooltipPlacement}
      type={tooltipType}
      className={wrapperClassName}
      hoverDesktopOnly
      inGroup
      inPortal
    >
      <ControlButton
        variant={variant}
        className={cx({ 'hover:!bg-black5': isLightTheme && !isActive }, className)}
        badgeValue={badgeValue}
        hasNotificationBubble={hasNotificationBubble}
        disabled={disabled}
        aria-pressed={isActive}
        {...rest}
      >
        {isLoading ? (
          <Spinner size="xs" />
        ) : (
          <Icon
            className={cx(
              'stroke-1.5 h-6 w-6 pointer-events-none',
              isActive ? 'stroke-white' : 'stroke-gray-60 dark:stroke-white',
              iconClassName
            )}
          />
        )}
      </ControlButton>
    </Tooltip>
  );
};

export default withClickLog(FooterButton);
