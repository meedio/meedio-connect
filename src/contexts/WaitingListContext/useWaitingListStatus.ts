import { EventType, JoinRule, RoomState, RoomStateEvent } from 'matrix-js-sdk/src/matrix';
import { useEffect, useState } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import { commonStateKeys } from 'utils/matrixUtils';

const useWaitingListStatus = () => {
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const { matrixClient } = useMatrixContext();
  const [isWaitingListEnabled, setIsWaitingListEnabled] = useState(true);

  useEffect(() => {
    matrixClient
      .getStateEvent(roomId, EventType.RoomJoinRules, commonStateKeys.default)
      .then(({ join_rule }) => setIsWaitingListEnabled(join_rule === JoinRule.Knock))
      .catch((error) => console.error('Error fetching join rules:', error));
  }, [roomId, matrixClient]);

  useEffect(() => {
    const handleStateChanged = (state: RoomState) => {
      if (state.roomId !== roomId) return;

      const joinRule = state.getStateEvents(EventType.RoomJoinRules, commonStateKeys.default)?.getContent().join_rule;
      if (!joinRule) return;

      if (joinRule === JoinRule.Knock && !isWaitingListEnabled) return setIsWaitingListEnabled(true);
      if (joinRule !== JoinRule.Knock && isWaitingListEnabled) return setIsWaitingListEnabled(false);
    };

    matrixClient.on(RoomStateEvent.Update, handleStateChanged);

    return () => {
      matrixClient.off(RoomStateEvent.Update, handleStateChanged);
    };
  }, [roomId, matrixClient, isWaitingListEnabled, setIsWaitingListEnabled]);

  return isWaitingListEnabled;
};

export default useWaitingListStatus;
