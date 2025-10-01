import cx from 'classnames';

import { IconType } from 'utils/types';

const iconVariants = {
  default: 'stroke-black',
  alert: 'stroke-tertiary-50',
  white: 'stroke-white',
};

const backgroundVariants = {
  default: 'bg-gradient-green',
  alert: 'bg-tertiary-50',
};

export type IconVariant = keyof typeof iconVariants;
export type BackgroundVariant = keyof typeof backgroundVariants;

interface GradientIconWithShadowProps {
  icon: IconType;
  iconVariant?: IconVariant;
  bgVariant?: BackgroundVariant;
  className?: string;
}

const GradientIconWithShadow = ({
  icon: Icon,
  iconVariant = 'default',
  className,
  bgVariant = 'default',
}: GradientIconWithShadowProps) => (
  <div className={cx('shadow-icon bg-gradient-white w-fit rounded-3xl p-2', className)}>
    <div className={cx('rounded-2xl p-4', backgroundVariants[bgVariant])}>
      <Icon className={cx('h-8 w-8 shrink-0 stroke-2', iconVariants[iconVariant])} />
    </div>
  </div>
);

export default GradientIconWithShadow;
