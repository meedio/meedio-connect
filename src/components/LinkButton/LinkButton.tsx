import { defaultHoverTransition } from '@shared/utils';
import cx from 'classnames';
import { HTMLAttributeAnchorTarget, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

const variants = {
  light: 'text-gray-60 hover:text-gray-100',
  dark: 'text-white72 hover:text-gray-0',
  primary: 'text-primary-50 hover:underline',
  gray80: 'text-gray-80',
};

export type LinkButtonVariantType = keyof typeof variants;

interface LinkButtonProps {
  link?: string;
  variant?: LinkButtonVariantType;
  className?: string;
  isExternal?: boolean;
  disabled?: boolean;
  target?: HTMLAttributeAnchorTarget;
}

const LinkButton = ({
  children,
  link,
  variant = 'light',
  className,
  disabled = false,
  isExternal = false,
  target,
  ...rest
}: PropsWithChildren<LinkButtonProps>) => {
  const style = cx('text-size-sm', variants[variant], defaultHoverTransition, className);

  if (isExternal) {
    return (
      <a href={link} rel="noreferrer" target="_blank" className={style} {...rest}>
        {children}
      </a>
    );
  }

  if (!link) return <div className={cx(style, { 'pointer-events-none': disabled })}>{children}</div>;

  return (
    <Link to={link} className={style} target={target} {...rest}>
      {children}
    </Link>
  );
};

export default LinkButton;
