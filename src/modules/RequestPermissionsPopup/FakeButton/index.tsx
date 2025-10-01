import cx from 'classnames';
import { ReactNode } from 'react';

interface FakeButtonProps {
  children: ReactNode;
  className?: string;
}

const FakeButton = ({ children, className }: FakeButtonProps) => (
  <span
    className={cx(
      'text-size-sm md:text-size-xs relative flex w-full cursor-default items-center justify-center rounded border px-4 py-[9px] font-medium md:w-auto md:py-[7px]',
      className
    )}
  >
    {children}
  </span>
);

export default FakeButton;
