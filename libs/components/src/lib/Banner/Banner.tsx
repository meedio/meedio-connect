import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { ActionProps, BannerProps, CloseIconProps, IconProps, ClassNameProp } from './utils';
import { ReactComponent as AlertCircle } from '../../assets/icons/AlertCircle.svg';
import { ReactComponent as Check } from '../../assets/icons/Check.svg';
import { ReactComponent as CheckPrimary } from '../../assets/icons/CheckPrimary.svg';
import { ReactComponent as Info } from '../../assets/icons/Info.svg';
import { ReactComponent as Warning } from '../../assets/icons/Warning.svg';
import { ReactComponent as X } from '../../assets/icons/X.svg';
import Button from '../Button/Button';
import RoundedContainer from '../RoundedContainer/RoundedContainer';

export const variants = {
  neutral: 'bg-primary-5',
  success: 'bg-primaryComp-50 border border-white20',
  successPrimary: 'bg-primary-50',
  warning: 'bg-warning-5',
  alert: 'bg-alert-50',
};

const textColor = {
  neutral: 'text-gray-100',
  success: 'text-white',
  successPrimary: 'text-white',
  warning: 'text-gray-100',
  alert: '!text-white',
};

const iconStyle = 'shrink-0 self-start';
const successIconStyle = 'stroke-current text-transparent';

const iconStyles = {
  neutral: '',
  success: successIconStyle,
  successPrimary: successIconStyle,
  warning: '',
  alert: 'stroke-current text-white',
};

export const iconSizes = { sm: 'w-5 h-5', md: 'w-6 h-6' };

const icons = {
  neutral: Info,
  success: CheckPrimary,
  successPrimary: Check,
  warning: Warning,
  alert: AlertCircle,
};

const Banner = ({ variant, className, children }: PropsWithChildren<BannerProps>) => (
  <RoundedContainer
    variant="neutral"
    radiusVariant="lg"
    className={cx('shadow-xs px-4 py-2.5', variants[variant], textColor[variant], className)}
  >
    {children}
  </RoundedContainer>
);

const Action = ({ children, onClick }: PropsWithChildren<ActionProps>) => (
  <Button
    variant="text"
    className="text-size-sm !h-fit-content !w-fit-content !p-0 font-medium !text-current"
    onClick={onClick}
  >
    {children}
  </Button>
);

const Icon = ({ variant, size = 'sm' }: IconProps) => {
  const Icon = icons[variant];

  return (
    <Icon
      className={cx('mr-4 mt-0', { '!mr-2 !mt-0.5': size === 'sm' }, iconStyles[variant], iconStyle, iconSizes[size])}
    />
  );
};

const Subtitle = ({ children, className }: PropsWithChildren<ClassNameProp>) => (
  <span className={cx('text-size-xs my-auto', className)}>{children}</span>
);

const Title = ({ children, className }: PropsWithChildren<ClassNameProp>) => (
  <span className={cx('text-size-sm font-medium', className)}>{children}</span>
);

const Container = ({ children }: PropsWithChildren) => <div className="flex w-full flex-col space-y-2">{children}</div>;

const CloseButton = ({ onClose }: CloseIconProps) => (
  <X className="h-5 w-5 shrink-0 stroke-current hover:cursor-pointer" onClick={onClose} />
);

Banner.Icon = Icon;
Banner.Title = Title;
Banner.Subtitle = Subtitle;
Banner.Action = Action;
Banner.CloseButton = CloseButton;
Banner.Container = Container;

export default Banner;
