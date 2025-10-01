import cx from 'classnames';
import { PropsWithChildren } from 'react';

import useCollapsibleContext from '../useCollapsibleContext';

interface CollapsibleHeadProps {
  className?: string;
}

const CollapsibleHead = ({ children, className }: PropsWithChildren<CollapsibleHeadProps>) => {
  const { toggleIsCollapsed, isCollapsible } = useCollapsibleContext();

  const handleClick = isCollapsible ? toggleIsCollapsed : undefined;

  return (
    <div
      className={cx('flex justify-between items-center space-x-2 p-4', { 'cursor-pointer': isCollapsible }, className)}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default CollapsibleHead;
