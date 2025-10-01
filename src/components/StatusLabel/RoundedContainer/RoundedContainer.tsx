import cx from 'classnames';
import { ReactNode } from 'react';

interface RoundedContainerProps {
  children: ReactNode;
  className?: string;
}

const RoundedContainer = ({ children, className }: RoundedContainerProps) => (
  <div
    className={cx(
      'text-size-xs bg-black80 flex flex-row items-center rounded-full py-1.5 pl-1.5 pr-2 text-white',
      className
    )}
  >
    {children}
  </div>
);

export default RoundedContainer;
