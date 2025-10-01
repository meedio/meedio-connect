import { KnownMembership, MatrixEvent, RoomMember, RoomMemberEvent } from 'matrix-js-sdk/src/matrix';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';

type UseWaitingListMembersProps = { playSound?: () => void; roomId: string };

const useWaitingListMembers = ({ playSound, roomId }: UseWaitingListMembersProps) => {
  const { t } = useTranslation();
  const { matrixClient } = useMatrixContext();
  const { pushToast } = useToast();
  const [waitingListMembers, setWaitingListMembers] = useState<RoomMember[]>([]);
  const hasInitialWaitingListSeed = useRef(false);

  const isRoomOwner = matrixClient.getRoom(roomId)?.getMember(matrixClient.getUserId() || '')?.powerLevel === 100;
  const userId = matrixClient.getUserId();

  const updateWaitingList = useCallback(() => {
    const room = matrixClient.getRoom(roomId);
    if (!room) {
      console.debug(`Was trying to update waiting list for room: ${roomId}, but room was not found`);
      pushToast({
        variant: 'warning',
        title: t('something_wrong'),
        description: t('could_not_find_room'),
      });
      return;
    }

    const members = room.getMembers().filter(({ membership }) => membership === KnownMembership.Knock);
    setWaitingListMembers(members);
  }, [matrixClient, roomId, pushToast, t]);

  useEffect(() => {
    if (!hasInitialWaitingListSeed.current) {
      updateWaitingList();
      hasInitialWaitingListSeed.current = true;
    }

    const handleMembershipChange = (_: MatrixEvent, member: RoomMember) => {
      if (member.roomId !== roomId) return;

      const hasKnockMembership = member.membership === KnownMembership.Knock;
      const isUserInWaitingList = waitingListMembers.some(
        (waitingListMember) => waitingListMember.userId === member.userId
      );

      if (hasKnockMembership || isUserInWaitingList) updateWaitingList();
      if (hasKnockMembership && !isUserInWaitingList && member.userId !== userId && isRoomOwner && playSound) {
        playSound();
      }
    };

    matrixClient.on(RoomMemberEvent.Membership, handleMembershipChange);

    return () => {
      matrixClient.off(RoomMemberEvent.Membership, handleMembershipChange);
    };
  }, [roomId, userId, updateWaitingList, matrixClient, waitingListMembers, playSound, isRoomOwner]);

  return waitingListMembers;
};

export default useWaitingListMembers;
