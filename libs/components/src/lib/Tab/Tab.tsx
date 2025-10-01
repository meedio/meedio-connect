import cx from 'classnames';
import { ComponentPropsWithRef, FC } from 'react';

import Button from '../Button/Button';

export interface TabProps extends ComponentPropsWithRef<'button'> {
  isActive?: boolean;
  dataTestId?: string;
  variant?: TabVariant;
}

const tabVariants = {
  primary: 'md:w-fit-content',
  secondary: 'w-full',
};

export type TabVariant = keyof typeof tabVariants;

const Tab: FC<TabProps> = ({
  children,
  isActive = false,
  className,
  dataTestId,
  variant = 'primary',
  ...rest
}: TabProps) => (
  <div className={cx('flex flex-col', tabVariants[variant])}>
    <Button
      variant="textSecondary"
      size="sm"
      className={cx('!px-3 !pb-2 !font-medium', className)}
      data-testid={dataTestId}
      aria-pressed={isActive}
      type="button"
      {...rest}
    >
      {children}
    </Button>
    {isActive && <div className="bg-primary-50 h-0.5 rounded-sm" />}
    {variant === 'secondary' && !isActive && <div className="h-0.5 rounded-sm bg-gray-20" />}
  </div>
);

export default Tab;
