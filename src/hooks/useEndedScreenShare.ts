import { useEffect } from 'react';

import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';

//NOTE: hook to reset isScreenTilesVisible after screen share ends
const useEndedScreenShare = (hasActiveScreenShare: boolean) => {
  const {
    dispatch,
    actions,
    state: { isScreenTilesVisible },
  } = useRoomUIContext();

  useEffect(() => {
    if (!hasActiveScreenShare && !isScreenTilesVisible) dispatch(actions.toggleIsScreenTilesVisible());
  }, [actions, dispatch, hasActiveScreenShare, isScreenTilesVisible]);
};

export default useEndedScreenShare;
