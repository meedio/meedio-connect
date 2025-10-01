import cx from 'classnames';
import { ReactNode } from 'react';

interface RoomFooterProps {
  children: ReactNode;
  isFloating?: boolean;
}

const RoomFooter = ({ children, isFloating = false }: RoomFooterProps) => (
  <div
    className={cx('space-x-2 align-center grid-cols-footer grid justify-between', {
      'dark:bg-black90 bg-white90 mx-2 mb-2 w-auto rounded-3xl border p-2 dark:border-0': isFloating,
      'w-full bg-transparent px-4 py-4': !isFloating,
    })}
  >
    {children}
  </div>
);

export default RoomFooter;
