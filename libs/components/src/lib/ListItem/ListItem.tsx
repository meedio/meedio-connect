import cx from 'classnames';
import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

import { defaultHoverTransition } from '../../utils/utils';
import Divider from '../Divider/Divider';

interface ListItemProps extends ComponentPropsWithoutRef<'div'> {
  isActive?: boolean;
  dataTestId?: string;
  hasEffects?: boolean;
}

interface LeftSideProps {
  onClick?: () => void;
}

const LeftSide = ({ children, onClick }: PropsWithChildren<LeftSideProps>) => (
  <div className="flex min-w-0 max-w-full items-center space-x-2 md:space-x-4" onClick={onClick}>
    {children}
  </div>
);

const RightSide = ({ children, className, ...rest }: PropsWithChildren<ComponentPropsWithoutRef<'div'>>) => (
  <div className={cx('flex items-center', className)} {...rest}>
    {children}
  </div>
);

const ListItem = ({
  children,
  onClick,
  dataTestId,
  isActive = false,
  className,
  hasEffects = true,
  ...rest
}: PropsWithChildren<ListItemProps>) => (
  <>
    <div
      className={cx(
        'flex w-full items-center justify-between overflow-hidden p-2',
        {
          'rounded-2xl border hover:cursor-pointer hover:border-transparent hover:bg-white hover:shadow-sm': hasEffects,
          [defaultHoverTransition]: hasEffects,
          'border-gray-30 bg-white': isActive && hasEffects,
          'border-transparent': !isActive && hasEffects,
        },
        className
      )}
      data-testid={dataTestId}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
    <Divider className="last:hidden" verticalSpace="sm" />
  </>
);

ListItem.LeftSide = LeftSide;
ListItem.RightSide = RightSide;

export default ListItem;
