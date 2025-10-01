import { MatrixError } from 'matrix-js-sdk/src';
import { useCallback } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import logger from 'utils/logging/faro';

import useJoinMatrixRoom from './useJoinMatrixRoom';
import { getViaServers } from 'utils/matrixUtils';

const useRoomKnock = () => {
  const { matrixClient } = useMatrixContext();
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const joinMatrixRoom = useJoinMatrixRoom();

  const handleFailedKnock = useCallback(
    (error: MatrixError, shouldSkipJoinOnFail = false) => {
      if (error.httpStatus === 403 && !shouldSkipJoinOnFail) {
        logger.info('Knock failed, attempting to join the matrix room');
        return joinMatrixRoom();
      }

      logger.warn('Knock failed');
      throw error;
    },
    [joinMatrixRoom],
  );

  const knock = useCallback(
    async (shouldSkipJoinOnFail?: boolean) => {
      logger.info('Sending knock to the room', { roomId });
      await matrixClient
        .knockRoom(roomId, { viaServers: getViaServers(roomId, matrixClient) })
        .catch((e) => handleFailedKnock(e, shouldSkipJoinOnFail));
    },
    [matrixClient, roomId, handleFailedKnock],
  );

  return knock;
};

export default useRoomKnock;
