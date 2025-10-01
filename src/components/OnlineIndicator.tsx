import cx from 'classnames';
import { PropsWithChildren } from 'react';

type AvatarWithStatusProps = {
  isOnline?: boolean;
};

const OnlineIndicator = ({ isOnline, children }: PropsWithChildren<AvatarWithStatusProps>) => {
  const isOnlineIndicatorVisible = typeof isOnline === 'boolean';

  if (!isOnlineIndicatorVisible) return children;

  return (
    <div className="relative">
      {children}
      <div
        className={cx('rounded-[5px] border-2 border-white w-3 h-3 absolute -bottom-0.5 -right-0.5', {
          'bg-primaryComp-50': isOnline,
          'bg-white': !isOnline,
        })}
      >
        {!isOnline && <div className="border-2 border-gray-60 bg-white w-2 h-2 rounded-[3px]" />}
      </div>
    </div>
  );
};

export default OnlineIndicator;
