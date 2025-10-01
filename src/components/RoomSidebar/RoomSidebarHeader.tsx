import { PropsWithChildren } from 'react';

import { ReactComponent as X } from 'assets/icons/X.svg';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';

import RoomSidebarHeaderButton from './RoomSidebarHeaderButton';

type RoomSidebarHeaderProps = PropsWithChildren<{ additionalButtons?: JSX.Element }>;

const RoomSidebarHeader = ({ children, additionalButtons }: RoomSidebarHeaderProps) => {
  const {
    dispatch,
    actions: { closeSidebar },
  } = useRoomUIContext();

  const handleCloseSidebar = () => dispatch(closeSidebar());

  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-size-lg text-black">{children}</span>
      <div className="flex items-center space-x-2">
        {additionalButtons}
        <RoomSidebarHeaderButton icon={X} onClick={handleCloseSidebar} />
      </div>
    </div>
  );
};

export default RoomSidebarHeader;
