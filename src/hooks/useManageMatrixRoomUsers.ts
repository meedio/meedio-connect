import { useTranslation } from 'react-i18next';

import { ReactComponent as Alert } from 'assets/icons/Alert.svg';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import useToast from 'contexts/ToastProvider/useToast';
import logger from 'utils/logging/faro';

export enum MatrixMembershipChangeReasons {
  BAN = 'ban',
  KICK = 'kick',
  ACCEPT = 'accept',
  MOVE = 'move',
  UNASSIGNED = 'unassigned',
}

const useManageMatrixRoomUsers = () => {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const { matrixClient } = useMatrixContext();
  const {
    state: { roomId },
  } = useRoomIdentityContext();

  const pushInfoToast = (description: string) =>
    pushToast({ title: t('something_wrong'), description, icon: Alert, variant: 'info' });

  const kick = (matrixUserId: string) =>
    matrixClient.kick(roomId, matrixUserId, MatrixMembershipChangeReasons.KICK).catch((e) => {
      logger.error(`Error while trying to kick participant(id: ${matrixUserId}): `, e);
      pushInfoToast(t('participant_was_not_kicked'));
    });

  const ban = (matrixUserId: string) =>
    matrixClient.ban(roomId, matrixUserId, MatrixMembershipChangeReasons.BAN).catch((e) => {
      logger.error(`Error while trying to ban participant(id: ${matrixUserId}): `, e);
      pushInfoToast(t('participant_was_not_banned'));
    });

  const accept = (matrixUserId: string) =>
    matrixClient.invite(roomId, matrixUserId, MatrixMembershipChangeReasons.ACCEPT).catch((e) => {
      console.error(`Error while trying to accept participant(id: ${matrixUserId}): `, e);
      pushInfoToast(t('participant_was_not_accepted'));
    });

  return { kick, ban, accept };
};

export default useManageMatrixRoomUsers;
