import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import { useWaitingListContext } from 'contexts/WaitingListContext/useWaitingListContext';

import useToggleWaitingList from './useToggleWaitingList';

const useToggleRoomWaitingList = () => {
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const { isWaitingListEnabled, waitingListMembers } = useWaitingListContext();
  const { isToggleWaitingListLoading, toggleWaitingList } = useToggleWaitingList();

  const toggleRoomWaitingList = () => toggleWaitingList({ roomId, isWaitingListEnabled, waitingListMembers });

  return { toggleRoomWaitingList, isToggleWaitingListLoading };
};

export default useToggleRoomWaitingList;
