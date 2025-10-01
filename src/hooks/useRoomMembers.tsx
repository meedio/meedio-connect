import { MatrixEvent, RoomMember, RoomMemberEvent, KnownMembership } from 'matrix-js-sdk/src/matrix';
import { useEffect, useState } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';

const useRoomMembers = (roomId: string) => {
  const { matrixClient } = useMatrixContext();
  const [members, setMembers] = useState<RoomMember[]>([]);

  useEffect(() => {
    const room = matrixClient.getRoom(roomId);
    if (!room) return;

    const updateMembers = () => {
      const members = room.getJoinedMembers();
      setMembers(members);
    };

    const handleMembership = (_event: MatrixEvent, member: RoomMember) => {
      if (member.roomId !== roomId) return;

      const { membership } = member;
      if (
        membership &&
        [KnownMembership.Join, KnownMembership.Leave, KnownMembership.Ban].includes(membership as KnownMembership)
      ) {
        updateMembers();
      }
    };

    updateMembers();

    matrixClient.on(RoomMemberEvent.Membership, handleMembership);

    return () => {
      matrixClient.off(RoomMemberEvent.Membership, handleMembership);
    };
  }, [matrixClient, roomId]);

  return members;
};

export default useRoomMembers;
