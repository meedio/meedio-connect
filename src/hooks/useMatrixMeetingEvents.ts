import { MatrixEvent, RoomMember, RoomMemberEvent } from 'matrix-js-sdk/src/matrix';
import { KnownMembership } from 'matrix-js-sdk/src/types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import { ConnectionStatus } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import useToast from 'contexts/ToastProvider/useToast';

import { MatrixMembershipChangeReasons } from './useManageMatrixRoomUsers';

const useMatrixMeetingRoomEvents = () => {
  const { t } = useTranslation();
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const { matrixClient } = useMatrixContext();
  const { mxRtcSession } = useRoomStateContext();
  const { pushToast } = useToast();
  const { setConnectionStatus } = useSfuConnectionStateContext();

  useEffect(() => {
    const handleMembershipChange = (event: MatrixEvent, member: RoomMember) => {
      const isCurrentUserEvent = matrixClient.getUserId() === member.userId;
      const isCurrentMeetingEvent = event.getRoomId() === roomId;

      if (!isCurrentMeetingEvent || !isCurrentUserEvent) return;

      const { reason, membership } = event.getContent();
      const isKicked = reason === MatrixMembershipChangeReasons.KICK;
      const isBanned = membership === KnownMembership.Ban;

      if (isKicked || isBanned) {
        setConnectionStatus(ConnectionStatus.DISCONNECTED);

        const message = isKicked ? t('participant_kicked') : t('participant_banned');
        pushToast({ title: message, variant: 'info' });
      }
    };

    matrixClient.on(RoomMemberEvent.Membership, handleMembershipChange);

    return () => {
      matrixClient.off(RoomMemberEvent.Membership, handleMembershipChange);
    };
  }, [matrixClient, roomId, pushToast, t, mxRtcSession, setConnectionStatus]);
};

export default useMatrixMeetingRoomEvents;
