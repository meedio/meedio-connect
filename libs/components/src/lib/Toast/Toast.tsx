import cx from 'classnames';
import { PropsWithChildren } from 'react';

import {
  ActionProps,
  CloseIconProps,
  HeaderProps,
  NotificationProps,
  OuterContainerProps,
  SubtitleProps,
  ToastProps,
} from './utils';
import { ReactComponent as X } from '../../assets/icons/X.svg';
import Button from '../Button/Button';

export const variants = {
  primary: 'bg-primary-50 !text-white',
  light: 'bg-gray-5 text-gray-100',
  dark: 'bg-gray-100 text-white',
};

const subtitleStyles = {
  primary: 'text-white72',
  light: 'text-gray-80',
  dark: 'text-white72',
};

const Toast = ({ variant, className, children }: ToastProps) => (
  <div
    className={cx(
      'text-size-sm shadow-tooltip flex flex-col justify-between rounded p-4 text-gray-100',
      variants[variant],
      className
    )}
  >
    {children}
  </div>
);

const Title = ({ children }: PropsWithChildren) => <span className="text-size-sm font-medium">{children}</span>;

const Subtitle = ({ children, variant }: SubtitleProps) => (
  <span className={cx('max-w-[288px]', subtitleStyles[variant])}>{children}</span>
);

const CloseIcon = ({ onClose }: CloseIconProps) => (
  <X className={cx('h-5 w-5 shrink-0 stroke-current hover:cursor-pointer')} onClick={onClose} />
);

const Action = ({ children, onClick, variant }: ActionProps) => (
  <Button
    variant="text"
    className={cx('text-size-sm text-primary-50 w-fit-content !h-fit-content !p-0 font-medium', {
      '!text-white': variant === 'primary',
    })}
    onClick={onClick}
  >
    {children}
  </Button>
);

const Notification = ({ children, appName }: NotificationProps) => (
  <div className="text-gray-80 text-size-xs mb-4">
    {appName && (
      <span>
        {appName} <span>&bull; </span>
      </span>
    )}
    {children}
  </div>
);

const Header = ({ title, children, className }: HeaderProps) => (
  <div className={cx('flex w-full flex-row items-center justify-between', className)}>
    <Toast.Title>{title}</Toast.Title>
    <div className="flex flex-row justify-between space-x-4">{children}</div>
  </div>
);

const Footer = ({ children }: PropsWithChildren) => (
  <div className="border-gray-5 mt-4 flex items-center justify-center border-t py-4">{children}</div>
);

const OuterContainer = ({ children, className }: OuterContainerProps) => (
  <div className={cx('flex flex-row space-x-4', className)}>{children}</div>
);

const InnerContainer = ({ children }: PropsWithChildren) => (
  <div className="flex w-full flex-col space-y-2">{children}</div>
);

const NotificationContainer = ({ children }: PropsWithChildren) => (
  <div className="flex justify-between">{children}</div>
);

Toast.Title = Title;
Toast.Subtitle = Subtitle;
Toast.Action = Action;
Toast.CloseIcon = CloseIcon;
Toast.Notification = Notification;
Toast.Header = Header;
Toast.Footer = Footer;
Toast.OuterContainer = OuterContainer;
Toast.InnerContainer = InnerContainer;
Toast.NotificationContainer = NotificationContainer;

export default Toast;
