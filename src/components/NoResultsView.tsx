import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { ReactComponent as Search } from 'assets/icons/Search.svg';

interface NoResultsViewProps {
  title: string;
  className?: string;
}

const NoResultsView = ({ children, title, className }: PropsWithChildren<NoResultsViewProps>) => (
  <div
    className={cx(
      'bg-gray-10 mb-10 flex w-full flex-col items-center space-y-4 rounded-2xl p-12 text-center',
      className
    )}
  >
    <Search className="stroke-grayscale-black stroke-1.5 h-6 w-6" />
    <div className="flex flex-col space-y-1">
      <p className="text-grayscale-black text-size-md font-medium">{title}</p>
      <span className="text-grayscale-gray80 text-size-sm">{children}</span>
    </div>
  </div>
);

export default NoResultsView;
