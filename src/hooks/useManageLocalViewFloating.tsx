import { useEffect } from 'react';

import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { TileDescriptor } from 'contexts/VideoGridContext/utils';

const useManageLocalViewFloating = (items: TileDescriptor[]) => {
  const {
    dispatch,
    actions,
    state: { isLocalViewFloatingEnabled },
  } = useRoomUIContext();

  useEffect(() => {
    const shouldEnableLocalViewFloating = !isLocalViewFloatingEnabled && items.length <= 2;
    const shouldDisableLocalViewFloating = isLocalViewFloatingEnabled && items.length > 2;

    if (shouldEnableLocalViewFloating) {
      dispatch(actions.setValues({ isLocalViewFloatingEnabled: true }));
    } else if (shouldDisableLocalViewFloating) {
      dispatch(actions.setValues({ isLocalViewFloatingEnabled: false }));
    }
  }, [actions, dispatch, isLocalViewFloatingEnabled, items]);
};

export default useManageLocalViewFloating;
