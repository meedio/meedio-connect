import { KnownMembership, MatrixEvent, RoomMember, RoomMemberEvent } from 'matrix-js-sdk/src';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import logger from 'utils/logging/faro';
import { SetState } from 'utils/types';

export type RoomMembershipContextType = {
  setCurrentMembership: SetState<KnownMembership | undefined>;
  currentMembership?: KnownMembership;
};

export const RoomMembershipContext = createContext<RoomMembershipContextType | null>(null);

export const RoomMembershipProvider = ({ children }: PropsWithChildren) => {
  const { matrixClient } = useMatrixContext();
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const [currentMembership, setCurrentMembership] = useState<KnownMembership>();

  useEffect(() => {
    const initialMembership = matrixClient.getRoom(roomId)?.getMyMembership() as KnownMembership | undefined;
    setCurrentMembership(initialMembership);
  }, [matrixClient, roomId]);

  useEffect(() => {
    const currentUserId = matrixClient.getUserId();
    if (!currentUserId) return;

    const handleMembershipChange = (_: MatrixEvent, member: RoomMember) => {
      const isCurrentRoom = member.roomId === roomId;
      const isCurrentUser = member.userId === currentUserId;
      if (!isCurrentRoom || !isCurrentUser) return;

      setCurrentMembership((prev) => {
        logger.info('Membership has changed for current participant', {
          newMembership: member.membership,
          oldMembership: prev,
        });

        return member.membership as KnownMembership;
      });
    };

    matrixClient.on(RoomMemberEvent.Membership, handleMembershipChange);
    return () => {
      matrixClient.off(RoomMemberEvent.Membership, handleMembershipChange);
    };
  }, [matrixClient, roomId, setCurrentMembership]);

  return (
    <RoomMembershipContext.Provider value={{ currentMembership, setCurrentMembership }}>
      {children}
    </RoomMembershipContext.Provider>
  );
};
