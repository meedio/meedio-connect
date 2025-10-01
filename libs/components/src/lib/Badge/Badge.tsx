import cx from 'classnames';
import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

const variants = {
  alert: 'bg-tertiary-50 text-white',
  contrast: 'bg-white10 text-white',
  secondary: 'bg-secondary-50 text-white',
};

const sizes = {
  sm: 'rounded-md min-h-[16px] min-w-[16px] text-size-xs',
  md: 'rounded-lg min-h-[24px] min-w-[24px]',
  text: 'rounded-full px-2',
};

export type BadgeVariant = keyof typeof variants;
export type BadgeSize = keyof typeof sizes;

export interface BadgeProps extends ComponentPropsWithoutRef<'div'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const Badge = ({ children, variant = 'alert', size = 'md', className, ...rest }: PropsWithChildren<BadgeProps>) => (
  <div
    className={cx(
      'text-size-xs flex w-fit items-center justify-center px-1',
      variants[variant],
      sizes[size],
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export default Badge;
