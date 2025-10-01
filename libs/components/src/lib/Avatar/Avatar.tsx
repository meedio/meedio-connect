import cx from 'classnames';
import { ComponentPropsWithoutRef, PropsWithChildren, memo } from 'react';

import { getInitials } from './utils';
import { ReactComponent as User } from '../../assets/icons/User.svg';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';

const avatarSizes = {
  xs: 'w-8 h-8 rounded-xl text-size-xs',
  sm: 'w-10 h-10 rounded-xl text-size-sm',
  md: 'w-12 h-12 rounded-2xl',
  lg: 'w-20 h-20 rounded-2xl',
  header: 'w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl',
};

const iconSizes = {
  xs: 'w-5 h-5',
  sm: 'w-5 h-5',
  md: 'w-5 h-5',
  lg: 'w-10 h-10',
  header: '',
};

export type AvatarSize = keyof typeof avatarSizes;

export interface AvatarProps extends ComponentPropsWithoutRef<'div'> {
  name?: string;
  className?: string;
  size?: AvatarSize;
}

const Avatar = ({ children, name, className, size = 'md', ...rest }: PropsWithChildren<AvatarProps>) => {
  const initials = getInitials(name);
  const avatarContent = (initials && initials) || <User className={cx('stroke-current', iconSizes[size])} />;

  return (
    <div
      className={cx(
        'bg-primaryComp-50 flex shrink-0 select-none items-center justify-center font-medium text-white',
        avatarSizes[size],
        className
      )}
      {...rest}
      translate="no"
    >
      <ConditionalWrapper
        condition={size === 'lg'}
        wrapper={(children) => <h3>{children}</h3>}
        elseWrapper={(children) => <span className="font-medium">{children}</span>}
      >
        {children || avatarContent}
      </ConditionalWrapper>
    </div>
  );
};

export default memo(Avatar);
