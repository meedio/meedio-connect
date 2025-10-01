import cx from 'classnames';
import { ReactNode, HTMLAttributes, memo } from 'react';

import { meetingTestingConstants } from '../../../../constants/src';
import Badge, { BadgeSize } from '../../lib/Badge/Badge';
import { defaultHoverTransition } from '../../utils/utils';

const disabledPrimary = 'disabled:bg-gray-80 disabled:text-gray-50';

const buttonVariants = {
  primary: 'bg-primary-50 hover:bg-primary-60',
  tertiary: `text-gray-100 border-gray-20 hover:text-gray-100 hover:border-gray-100 ${disabledPrimary}`,
  destructivePrimary: `text-white bg-tertiary-50 hover:bg-tertiary-60 ${disabledPrimary}`,
  contrastPrimary: 'bg-primary-20 hover:bg-primary-50',
  contrastSecondary: `hover:bg-white10 ${disabledPrimary}`,
};

export type ControlButtonVariant = keyof typeof buttonVariants;

export interface ControlButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
  variant?: ControlButtonVariant;
  badgeValue?: number;
  badgeSize?: BadgeSize;
  hasNotificationBubble?: boolean;
}

const ControlButton = ({
  children,
  className,
  disabled = false,
  variant = 'contrastSecondary',
  badgeValue = 0,
  badgeSize = 'md',
  hasNotificationBubble = false,
  ...rest
}: ControlButtonProps) => (
  <button
    disabled={disabled}
    className={cx(
      'cursor-pointer relative rounded-xl p-2 focus:outline-none disabled:pointer-events-none',
      defaultHoverTransition,
      buttonVariants[variant],
      className
    )}
    {...rest}
  >
    {children}
    {badgeValue > 0 && (
      <Badge
        size={badgeSize}
        className={cx('absolute', badgeSize === 'sm' ? '-top-1 -right-1' : '-top-2.5 -right-2.5')}
      >
        {badgeValue}
      </Badge>
    )}
    {hasNotificationBubble && (
      <div
        className="absolute bg-tertiary-50 h-2.5 w-2.5 md:w-3 md:h-3 rounded-full right-0 top-0 md:-top-1 md:-right-1"
        data-testid={meetingTestingConstants.notificationsIndicator}
      />
    )}
  </button>
);

export default memo(ControlButton);
