import { Body, Method } from 'matrix-js-sdk/src';
import { encodeUri } from 'matrix-js-sdk/src/utils';
import { useCallback, useMemo } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import logger from 'utils/logging/faro';
import retryPromise from 'utils/retryPromise';

const useJoinMatrixRoom = (shouldJoinActiveMeeting = true) => {
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const { setShouldJoinMeetingOnRoom } = useSfuConnectionStateContext();
  const { matrixClient } = useMatrixContext();

  const homeserverUrl = roomId.split(':')[1];
  const viaServers = useMemo(() => (homeserverUrl ? [homeserverUrl] : undefined), [homeserverUrl]);

  const joinMatrixRoom = useCallback(
    (data?: Body) => {
      if (data) {
        const path = encodeUri('/join/$roomid', { $roomid: roomId });
        return retryPromise({
          fn: () => matrixClient.http.authedRequest(Method.Post, path, { via: viaServers }, data),
          label: 'authedRequest matrix room join with payload',
        })
          .then((response) => {
            logger.info('Matrix room join using authedRequest was successful');
            if (shouldJoinActiveMeeting) {
              logger.info('Setting shouldJoinMeetingOnRoom to true');
              setShouldJoinMeetingOnRoom(true);
            }

            return response;
          })
          .catch((error) => {
            logger.error('Matrix room join using authedRequest failed', error);
            throw error;
          });
      }

      return retryPromise({
        fn: () => matrixClient.joinRoom(roomId, { viaServers }),
        label: 'Join matrix room without payload',
      })
        .then((room) => {
          logger.info('Matrix room join using joinRoom was successful');
          if (shouldJoinActiveMeeting) {
            logger.info('Setting setShouldJoinMeetingOnRoom to true');
            setShouldJoinMeetingOnRoom(true);
          }

          return room;
        })
        .catch((error) => {
          logger.error('Matrix room join using joinRoom failed', error);
          throw error;
        });
    },
    [matrixClient, roomId, setShouldJoinMeetingOnRoom, shouldJoinActiveMeeting, viaServers]
  );

  return joinMatrixRoom;
};

export default useJoinMatrixRoom;
