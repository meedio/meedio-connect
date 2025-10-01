import cx from 'classnames';
import { title } from 'process';
import { PropsWithChildren, isValidElement } from 'react';

import { IconType } from 'utils/types';

import ToastProgressBar from './ToastProgressBar';
import { ReactComponent as X } from '../../assets/icons/X.svg';
import Button, { ButtonVariant } from '../../lib/Button/Button';

const toastBgColors = {
  info: 'bg-grayscale-gray20',
  success: 'bg-complementary-50',
  warning: 'bg-secondary-50',
  error: 'bg-tertiary-50',
  dark: 'bg-grayscale-black',
  gray: 'bg-gray-90',
};

const toastVariants = {
  info: `${toastBgColors.info} border-black10`,
  success: `${toastBgColors.success} border-primaryComp-30`,
  warning: `${toastBgColors.warning} border-white20`,
  error: `${toastBgColors.error} border-white20`,
  dark: `${toastBgColors.dark} border-white20`,
  gray: `${toastBgColors.gray} border-gray-70`,
};

const toastIconVariants = {
  info: 'text-grayscale-black',
  success: 'stroke-white',
  warning: 'stroke-white',
  error: 'stroke-white',
  dark: 'stroke-white',
  gray: 'stroke-primaryComp-50',
};

const toastSizes = {
  sm: { text: 'text-size-sm', closeIcon: 'w-4 h-4', bannerIcon: 'w-5 h-5', verticalMargin: 'space-y-1' },
  md: { text: 'text-size-md', closeIcon: 'w-5 h-5', bannerIcon: 'w-6 h-6', verticalMargin: 'space-y-2' },
  lg: { text: 'text-size-lg', closeIcon: 'w-6 h-6', bannerIcon: 'w-6 h-6', verticalMargin: 'space-y-2' },
};

export type ToastVariant = keyof typeof toastVariants;
type ToastSize = keyof typeof toastSizes;

export interface ToastProps {
  variant?: ToastVariant;
  size?: ToastSize;
  hasCloseButton?: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onAction?: () => void;
  actionText?: string;
  actionButtonVariant?: ButtonVariant;
  icon?: IconType | JSX.Element;
  description?: string | JSX.Element;
  className?: string;
  duration?: number;
}

const Toast = ({
  variant = 'success',
  size = 'md',
  hasCloseButton = true,
  onClose,
  onComplete,
  onAction,
  actionText,
  actionButtonVariant,
  icon,
  description,
  className,
  children,
  duration,
}: PropsWithChildren<ToastProps>) => {
  const titleColor = variant === 'info' ? 'text-grayscale-black' : 'text-white';
  const descriptionColor = variant === 'info' ? 'text-grayscale-gray80' : 'text-white80';

  const renderIcon = () => {
    if (isValidElement(icon)) return icon;
    if (typeof icon === 'function') {
      const Icon = icon;
      return (
        <Icon
          className={cx('shrink-0 self-start mr-3 stroke-1.5', toastSizes[size].bannerIcon, toastIconVariants[variant])}
        />
      );
    }

    return null;
  };

  const barClassName = ['success', 'info'].includes(variant) ? 'bg-primaryComp-30' : 'bg-white50';
  const handleProgressComplete = () => {
    onClose();
    if (onComplete) onComplete();
  };

  return (
    <div
      className={cx(
        'max-w-100 flex h-fit w-full rounded-2xl border p-4 relative overflow-hidden',
        toastVariants[variant],
        toastSizes[size].text,
        { 'items-center': !description || !title },
        className
      )}
    >
      {renderIcon()}
      <div className="flex w-full justify-between space-x-4">
        <div className={cx('flex flex-col', toastSizes[size].verticalMargin)}>
          <span className={cx('font-medium', titleColor)}>{children}</span>
          {description && <span className={descriptionColor}>{description}</span>}
          {onAction && actionText && (
            <Button
              variant={actionButtonVariant || variant === 'warning' ? 'textContrastSecondary' : 'textContrast'}
              className="self-start"
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
        </div>
        {hasCloseButton && (
          <X
            className={cx('shrink-0 cursor-pointer stroke-1.5 stroke-current', toastSizes[size].closeIcon, titleColor)}
            onClick={onClose}
          />
        )}
      </div>
      {duration && (
        <ToastProgressBar
          duration={duration}
          onComplete={handleProgressComplete}
          trackClassName={toastBgColors[variant]}
          barClassName={barClassName}
        />
      )}
    </div>
  );
};

export default Toast;
