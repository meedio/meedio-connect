import cx from 'classnames';
import { PropsWithChildren } from 'react';

const badgeVariants = {
  stroked: 'bg-white border-gray-40',
  green: 'bg-secondary-20 border-secondary-20',
  red: 'bg-alert-5 border-alert-5',
};

const badgeSizes = {
  xs: 'px-1 text-size-xs',
  sm: 'py-1 px-2 text-size-xs',
  md: 'py-1.5 px-2 text-size-sm',
};

const radiusVariants = {
  full: 'rounded-full',
  sm: 'rounded-[3px]',
};

const labelDotVariants = {
  secondary: 'bg-secondary-50',
  primary: 'bg-primary-50',
  success: 'bg-success-50',
  gray: 'bg-gray-80',
  warning: 'bg-warning-50',
  alert: 'bg-alert-50',
  tertiary50: 'bg-tertiary-50',
};

export type BadgeVariant = keyof typeof badgeVariants;
type BadgeSize = keyof typeof badgeSizes;
export type LabelDotVariants = keyof typeof labelDotVariants;
type DotRadiusVariant = keyof typeof radiusVariants;

export interface SubtleBadgeProps {
  variant: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dataTestId?: string;
}

interface LabelDotProps {
  color: LabelDotVariants;
  radius?: DotRadiusVariant;
  className?: string;
}

const SubtleBadge = ({
  variant,
  size = 'sm',
  className,
  children,
  dataTestId,
}: PropsWithChildren<SubtleBadgeProps>) => (
  <span
    className={cx('truncate rounded-lg border text-gray-100', badgeVariants[variant], badgeSizes[size], className)}
    data-testid={dataTestId}
  >
    {children}
  </span>
);

const LabelDot = ({ color, radius = 'full', className }: LabelDotProps) => (
  <div className={cx('inline-flex h-2 w-2', labelDotVariants[color], radiusVariants[radius], className)} />
);

SubtleBadge.LabelDot = LabelDot;

export default SubtleBadge;
