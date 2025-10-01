import { Room } from 'matrix-js-sdk/src';
import { useCallback } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import { callLogPrefix } from 'contexts/RoomStateContext/RoomStateContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import logger from 'utils/logging/faro';
import { enterRTCSession } from 'utils/matrixUtils';

const useEnterRtcSession = () => {
  const { matrixClient } = useMatrixContext();
  const { setRtcSession } = useRoomStateContext();

  const enterRtcSession = useCallback(
    (room: Room) => {
      const rtcSession = matrixClient.matrixRTC.getRoomSession(room);

      logger.info(`${callLogPrefix} Joining room RTC session`, { roomId: room.roomId });
      enterRTCSession(rtcSession);
      setRtcSession(rtcSession);

      return rtcSession;
    },
    [matrixClient, setRtcSession],
  );

  return enterRtcSession;
};

export default useEnterRtcSession;
