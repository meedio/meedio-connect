import { KnownMembership } from 'matrix-js-sdk/src';
import { MatrixRTCSession, MatrixRTCSessionEvent } from 'matrix-js-sdk/src/matrixrtc/MatrixRTCSession';
import { useCallback, useEffect, useState } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import logger from 'utils/logging/faro';
import { enterRTCSession } from 'utils/matrixUtils';

const usePeekRtcSession = (roomId?: string) => {
  const { matrixClient } = useMatrixContext();
  const [rtcSession, setRtcSession] = useState<MatrixRTCSession>();

  const peekRtcSession = useCallback(
    async (roomId: string) => {
      let room = matrixClient.getRoom(roomId);
      const membership = room?.getMyMembership();
      const hasJoinMembership = membership === KnownMembership.Join;

      if (!hasJoinMembership) room = await matrixClient.joinRoom(roomId);
      if (!room) {
        return logger.error(`No room in usePeekRtcSession, participants' matrix room membership: ${membership}`);
      }

      const rtcSession = matrixClient.matrixRTC.getRoomSession(room);

      const isAlreadyJoined = rtcSession.isJoined();
      if (isAlreadyJoined) {
        rtcSession.emit(MatrixRTCSessionEvent.MembershipsChanged, [], []);
      } else {
        enterRTCSession(rtcSession);
      }

      return rtcSession;
    },
    [matrixClient]
  );

  useEffect(() => {
    if (!roomId) return;

    peekRtcSession(roomId)
      .then((session) => {
        if (session) setRtcSession(session);
      })
      .catch((err) => console.error(`Failed to peek into RTC session for ${roomId}`, err));
  }, [peekRtcSession, roomId]);

  return rtcSession;
};

export default usePeekRtcSession;
