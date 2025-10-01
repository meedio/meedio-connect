import { RoomEvent } from 'matrix-js-sdk/src';
import { CallMembership } from 'matrix-js-sdk/src/matrixrtc/CallMembership';
import { MatrixRTCSession, MatrixRTCSessionEvent } from 'matrix-js-sdk/src/matrixrtc/MatrixRTCSession';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import logger from 'utils/logging/faro';
import { SetState } from 'utils/types';

interface RoomStateContextType {
  mxRtcSession?: MatrixRTCSession;
  setRtcSession: SetState<MatrixRTCSession | undefined>;
  activeRoomId: string;
  setActiveRoomId: SetState<string>;
}

export const RoomStateContext = createContext<RoomStateContextType | null>(null);

export const callLogPrefix = '[Call]';

const RoomStateContextProvider = ({ children }: PropsWithChildren) => {
  const [mxRtcSession, setRtcSession] = useState<MatrixRTCSession>();
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const [activeRoomId, setActiveRoomId] = useState(roomId);

  useEffect(() => {
    if (!mxRtcSession) return;

    const onJoinStateChange = (isJoined: boolean): void =>
      logger.info(`${callLogPrefix} My own join state changed - isJoined: ${isJoined}`);
    mxRtcSession.addListener(MatrixRTCSessionEvent.JoinStateChanged, onJoinStateChange);

    const onManagerError = (error: unknown): void => logger.info(`${callLogPrefix} Membership manager error: ${error}`);
    mxRtcSession.addListener(MatrixRTCSessionEvent.MembershipManagerError, onManagerError);

    const onMembershipsChanged = (oldMemberships: CallMembership[], newMemberships: CallMembership[]) =>
      logger.info(
        `${callLogPrefix} Memberships changed event - old memberships: ${JSON.stringify(
          oldMemberships,
        )}, new memberships: ${JSON.stringify(newMemberships)}`,
      );
    mxRtcSession.addListener(MatrixRTCSessionEvent.MembershipsChanged, onMembershipsChanged);

    mxRtcSession.room.on(RoomEvent.Timeline, (event) =>
      logger.info(
        `${callLogPrefix} Room timeline event status - isBeingDecrypted: ${event.isBeingDecrypted()}, isDecryptionFailure: ${event.isDecryptionFailure()}`,
      ),
    );

    return () => {
      mxRtcSession.removeListener(MatrixRTCSessionEvent.JoinStateChanged, onJoinStateChange);
      mxRtcSession.removeListener(MatrixRTCSessionEvent.MembershipManagerError, onManagerError);
      mxRtcSession.removeListener(MatrixRTCSessionEvent.MembershipsChanged, onMembershipsChanged);
      setRtcSession(undefined);
    };
  }, [mxRtcSession]);

  return (
    <RoomStateContext.Provider
      value={{
        mxRtcSession,
        setRtcSession,
        activeRoomId,
        setActiveRoomId,
      }}
    >
      {children}
    </RoomStateContext.Provider>
  );
};

export default RoomStateContextProvider;
