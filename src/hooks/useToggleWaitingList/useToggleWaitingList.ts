import { EventType, JoinRule, KnownMembership, RoomMember } from 'matrix-js-sdk/src/matrix';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateRoomInIdentityServer } from 'api/identityService/updateRoomInIdentityServer';
import { ReactComponent as Alert } from 'assets/icons/Alert.svg';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';
import { getRoomSecret } from 'modules/CreateNewRoomModal/CreateRoomStepModal/utils';
import logger from 'utils/logger';

type ToggleWaitingListProps = {
  roomId: string;
  isWaitingListEnabled: boolean;
  waitingListMembers?: RoomMember[];
};

const useToggleWaitingList = () => {
  const { matrixClient } = useMatrixContext();
  const [isToggleWaitingListLoading, setIsToggleWaitingListLoading] = useState(false);
  const { pushToast } = useToast();
  const { t } = useTranslation();

  const inviteAllWaitingListMembers = (roomId: string, waitingListMembers?: RoomMember[]) => {
    let members = waitingListMembers;
    if (!members) {
      const room = matrixClient.getRoom(roomId);
      members = room?.getMembers().filter(({ membership }) => membership === KnownMembership.Knock) || [];

      if (!members.length) return;
    }

    return Promise.all(
      members.map(({ userId, rawDisplayName }) =>
        matrixClient.invite(roomId, userId).catch((err) => {
          logger.error(`Could not invite user ${userId} to room ${roomId}`, err);
          pushToast({
            title: t('something_wrong'),
            description: t('could_not_invite_user_to_room', { displayName: rawDisplayName }),
            icon: Alert,
            variant: 'warning',
          });
        })
      )
    );
  };

  const renderErrorToast = () =>
    pushToast({
      title: t('something_wrong'),
      description: t('could_not_toggle_waiting_list'),
      icon: Alert,
      variant: 'warning',
    });

  const changeJoinRule = (joinRule: JoinRule.Public | JoinRule.Knock, roomId: string) =>
    matrixClient.sendStateEvent(roomId, EventType.RoomJoinRules, { join_rule: joinRule }).catch((error) => {
      logger.error(error);
      renderErrorToast();
    });

  const toggleWaitingList = ({ roomId, isWaitingListEnabled, waitingListMembers }: ToggleWaitingListProps) => {
    if (!roomId) return;

    setIsToggleWaitingListLoading(true);

    const newRule = isWaitingListEnabled ? JoinRule.Public : JoinRule.Knock;

    return changeJoinRule(newRule, roomId)
      ?.then(() => {
        const room = matrixClient.getRoom(roomId);
        if (room) {
          const roomSecret = getRoomSecret(room);
          updateRoomInIdentityServer(roomId, roomSecret, { waiting_list: !isWaitingListEnabled }).catch((error) =>
            logger.error('Failed to update IS in waiting list toggle', error)
          );
        }
        if (isWaitingListEnabled) inviteAllWaitingListMembers(roomId, waitingListMembers);
      })
      .finally(() => setIsToggleWaitingListLoading(false));
  };

  return { toggleWaitingList, isToggleWaitingListLoading };
};

export default useToggleWaitingList;
