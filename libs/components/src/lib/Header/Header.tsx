import { meetingTestingConstants } from '@shared/constants';
import cx from 'classnames';
import { HTMLAttributes, ReactNode } from 'react';
import { To } from 'react-router-dom';

import { IconType } from 'utils/types';

import Button, { ButtonVariant } from '../Button/Button';
import GoBackButton from '../GoBackButton/GoBackButton';

const headerVariants = {
  light: 'bg-white border-gray-30 border-1 border-b',
  lightNoShadow: 'bg-white',
  dark: 'bg-black',
  transparent: 'bg-transparent',
};

interface HeaderControlProps extends HTMLAttributes<HTMLButtonElement> {
  icon: IconType;
  className?: string;
  variant?: ButtonVariant;
}

export type HeaderVariant = keyof typeof headerVariants;

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  variant: HeaderVariant;
  isFloating?: boolean;
  children?: ReactNode;
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

interface BackProps {
  path: To;
  isDark: boolean;
}

const CenterContainer = ({ children, className }: ContainerProps) => (
  <div className={cx('min-w-0 max-w-full xl:mx-4', className)}>{children}</div>
);

const RightContainer = ({ children, className }: ContainerProps) => (
  <div className={cx('inline-flex flex-1 items-center justify-end space-x-2', className)}>{children}</div>
);

const Control = ({ icon: Icon, variant = 'buttonIconContrastTertiary', className, ...rest }: HeaderControlProps) => (
  <Button size="neutral" variant={variant} className={cx('p-2 md:p-[11px]', className)} {...rest}>
    <Icon className="stroke-1.5 h-6 w-6 stroke-current" />
  </Button>
);

const Back = ({ path, isDark = false }: BackProps) => (
  <GoBackButton
    variant={isDark ? 'buttonIconContrastTertiary' : 'buttonIconTertiary'}
    className="mr-4 hidden md:flex"
    iconClassName={cx(isDark ? '!text-white72' : '!text-gray-60')}
    path={path}
  />
);

const Header = ({ variant, children, className, isFloating = false }: HeaderProps) => (
  <div
    className={cx('flex shrink-0 items-center', headerVariants[variant], {
      'dark:bg-black90 bg-white90 mx-2 mt-2 box-border w-auto rounded-3xl border p-2 dark:border-0': isFloating,
      'w-full px-4 py-4': !isFloating,
      className,
    })}
    data-testid={meetingTestingConstants.header}
  >
    {children}
  </div>
);

Header.Back = Back;
Header.Right = RightContainer;
Header.Center = CenterContainer;
Header.Control = Control;

export default Header;
