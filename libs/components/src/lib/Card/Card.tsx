import cx from 'classnames';
import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => (
  <div className={cx('flex h-full w-screen flex-col rounded-lg bg-white md:w-auto md:py-6', className)}>{children}</div>
);

export default Card;
