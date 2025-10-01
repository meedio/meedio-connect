import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { IconType } from 'utils/types';

interface EmptyStateViewProps {
  Icon: IconType;
  title?: string;
  className?: string;
}

const EmptyStateView = ({ children, Icon, className, title }: PropsWithChildren<EmptyStateViewProps>) => (
  <div className={cx('h-full p-4', className)}>
    <div className="flex h-full flex-col items-center">
      <Icon className="stroke-gray-80 h-6 w-6 shrink-0 stroke-2 mb-4" />
      {title && <p className="text-center text-size-md font-medium text-black mb-1">{title}</p>}
      <p className="text-size-sm text-center text-gray-100">{children}</p>
    </div>
  </div>
);

export default EmptyStateView;
