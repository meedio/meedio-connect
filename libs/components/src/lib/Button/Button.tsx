import cx from 'classnames';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactNode } from 'react';

import { getIconMargins, getIconStyle } from './utils';
import { ReactComponent as Loader } from '../../assets/icons/Loader.svg';
import { IconType } from '../../utils/types/index';
import { defaultHoverTransition } from '../../utils/utils';

const disabledCursorStyle = 'disabled:cursor-default';
const disabledPrimary = `disabled:text-gray-50 disabled:bg-gray-30 disabled:border-gray-30 ${disabledCursorStyle}`;
const disabledTertiary = `disabled:text-gray-50 disabled:bg-transparent disabled:border-gray-50 ${disabledCursorStyle}`;
const disabledSecondaryTertiary = `disabled:text-gray-50 disabled:bg-gray-20 disabled:border-gray-40 ${disabledCursorStyle}`;
const disabledContrast = `disabled:text-gray-50 disabled:bg-gray-80 disabled:border-gray-80 ${disabledCursorStyle}`;
const hoverContrastSecondary = 'hover:text-black hover:bg-white hover:border-white';
const contrastSecondary = 'text-white bg-white20 border-transparent';
const textButton = 'font-medium disabled:text-gray-50 !py-0 !px-0 border-0';

const buttonVariants = {
  primary: `text-white bg-primary-50 border-primary-50 hover:bg-primary-60 hover:border-primary-60 ${disabledPrimary}`,
  secondary: `text-white bg-black border-black hover:bg-primary-60 hover:border-primary-60 ${disabledPrimary}`,
  tertiary: `text-black border-gray-50 bg-transparent hover:text-white hover:bg-black  hover:border-black ${disabledTertiary}`,
  destructive: `text-white border-tertiary-50 bg-tertiary-50 hover:bg-tertiary-60 hover:border-tertiary-60 ${disabledPrimary}`,
  secondaryPrimary: `text-white bg-secondary-50 border-secondary-50 hover:bg-secondary-60 hover:border-secondary-60 ${disabledPrimary}`,
  secondarySecondary: `text-black bg-gray-30 border-gray-30 hover:bg-secondary-60 hover:text-white hover:border-secondary-60 ${disabledPrimary}`,
  secondaryTertiary: `text-gray-70 border-gray-40 bg-white hover:border-black hover:text-black ${disabledSecondaryTertiary}`,
  contrastPrimary: `text-black bg-white border-white hover:bg-white80 hover:border-transparent ${disabledContrast}`,
  contrastSecondary: `${contrastSecondary} hover:border-primary-60 hover:bg-primary-60 ${disabledContrast}`,
  contrastSecondaryNoHover: `${contrastSecondary} ${disabledContrast}`,
  contrastTertiary: `text-white bg-transparent border-white ${hoverContrastSecondary} ${disabledContrast}`,
  contrastGhost: `text-white border-transparent bg-transparent ${hoverContrastSecondary} ${disabledContrast}`,
  lightTextButton: 'text-size-sm font-medium text-gray-80 border-none',
  tabButton: 'hover:text-primary-50 border-none text-size-md disabled:text-gray-60 text-gray-100',
  text: `text-primary-50 hover:text-black ${textButton}`,
  textSecondary: `text-black hover:text-primary-50 ${textButton}`,
  textContrast: `text-primaryComp-50 hover:text-white ${textButton}`,
  textContrastSecondary: `text-white hover:text-primaryComp-50 ${textButton}`,
  buttonIconGhost: 'text-black border-none hover:bg-gray-30',
  buttonIconContrastTertiary:
    'text-white60 border-none md:border-solid border-white60 hover:border-white hover:text-white disabled:text-gray-50 disabled:border-gray-50',
  buttonIconTertiary:
    'text-gray-60 border-gray-50 hover:text-white hover:bg-black hover:border-black disabled:border-gray-30 disabled:text-gray-50',
  buttonIconSecondaryTertiary:
    'text-gray-60 border-none md:border-solid border-gray-40 hover:text-black hover:border-black disabled:border-gray-40 disabled:bg-gray-20 disabled:text-gray-50',
  buttonIconContrastGhost:
    'text-white hover:text-black border-none hover:bg-white disabled:border-white disabled:text-gray-50',
  buttonIconDestructiveTertiary: 'hover:border-tertiary-70',
  copy: 'text-gray-80 bg-gray-0 border-transparent',
  recordingDefault: 'hover:bg-white10 border-none',
  recordingAlert: 'bg-tertiary-50 hover:bg-tertiary-60 border-none',
  recordingSuccess: 'bg-primary-50 hover:bg-primary-60 border-none',
  ghost: `text-black border-transparent bg-transparent group-hover:bg-gray-20 group-hover:border-gray-20 ${disabledTertiary}`,
};

const buttonSizes = {
  lg: 'py-[15px] px-6 text-lg font-medium leading-6',
  md: 'py-[11px] px-6 text-md font-medium leading-6 rounded-2xl',
  sm: 'py-[9px] px-4 text-sm font-normal rounded-xl leading-5',
  xs: 'py-[11px] px-3 text-xs leading-4',
  textButton: 'py-3.5 px-0',
  icon: 'p-2 rounded-xl',
  neutral: '',
};

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

type IconProp = {
  icon?: IconType;
  className?: string;
};

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  iconLeft?: IconProp;
  iconRight?: IconProp;
}

export const buttonStyle =
  'flex justify-center items-center rounded-2xl border outline-none disabled:pointer-events-none';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size = 'md',
      className,
      children,
      loading = false,
      loadingText,
      disabled = false,
      iconLeft,
      iconRight,
      ...rest
    },
    ref
  ) => {
    const { icon: IconLeft, className: iconLeftClassName } = iconLeft || {};
    const { icon: IconRight, className: iconRightClassName } = iconRight || {};

    return (
      <button
        className={cx(
          'select-none',
          buttonStyle,
          buttonSizes[size],
          !!variant && buttonVariants[variant],
          defaultHoverTransition,
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...rest}
      >
        {loading && (
          <Loader
            className={cx(
              'mr-2 h-auto w-auto animate-spin select-none stroke-current',
              size === 'sm' ? 'mr-1 h-5 w-5' : 'mr-2 h-auto w-auto'
            )}
          />
        )}
        <div>
          {loadingText && loading ? (
            loadingText
          ) : (
            <div className={`flex truncate space-x-${getIconMargins(size, variant)}`}>
              {IconLeft && !loading && <IconLeft className={getIconStyle(size, iconLeftClassName)} />}
              {children && <div className="flex items-center truncate">{children}</div>}
              {IconRight && <IconRight className={getIconStyle(size, iconRightClassName)} />}
            </div>
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
