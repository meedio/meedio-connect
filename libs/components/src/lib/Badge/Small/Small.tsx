import cx from 'classnames';
import { HTMLAttributes } from 'react';

export type SmallBadgeProps = HTMLAttributes<HTMLDivElement>;

const SmallBadge = ({ className }: SmallBadgeProps) => (
  <div className={cx('bg-alert-50 max-w-0 rounded-full p-1', className)} />
);

export default SmallBadge;
