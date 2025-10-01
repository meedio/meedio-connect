import { KnownMembership } from 'matrix-js-sdk/src';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Alert } from 'assets/icons/Alert.svg';
import { useRoomMembershipContext } from 'contexts/RoomMembershipContext/useRoomMembershipContext';
import useToast from 'contexts/ToastProvider/useToast';
import useJoinMatrixRoom from 'hooks/useJoinMatrixRoom';
import logger from 'utils/logging/faro';

const useKnockHandler = () => {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const { currentMembership } = useRoomMembershipContext();
  const joinMatrixRoom = useJoinMatrixRoom();
  const [isKnocking, setIsKnocking] = useState(false);

  const isAcceptLoading =
    isKnocking && !!currentMembership && [KnownMembership.Invite, KnownMembership.Join].includes(currentMembership);

  const pushDeniedToast = useCallback(
    () =>
      pushToast({
        title: t('access_denied'),
        description: t('you_were_denied_to_join_the_room'),
        icon: Alert,
        variant: 'info',
        autoDismiss: false,
      }),
    [pushToast, t]
  );

  useEffect(() => {
    if (currentMembership === KnownMembership.Knock) setIsKnocking(true);
  }, [currentMembership]);

  useEffect(() => {
    if (!currentMembership || !isKnocking) return;

    const isDeniedFromWaitingList = currentMembership === KnownMembership.Leave;
    const isAcceptedInWaitingList = [KnownMembership.Invite, KnownMembership.Join].includes(currentMembership);

    if (isDeniedFromWaitingList) {
      logger.info('User was denied in the waiting list, will display a toast');
      pushDeniedToast();
    }

    if (isAcceptedInWaitingList) {
      logger.info(
        'User was accepted in the waiting list, will join the matrix room and update setShouldJoinMeetingWhenAvailable state'
      );
      joinMatrixRoom()?.catch(() => {
        setIsKnocking(false);
        pushToast({ title: t('cannot_join_room'), variant: 'info' });
      });
    }
  }, [currentMembership, isKnocking, joinMatrixRoom, pushDeniedToast, pushToast, t]);

  return { isAcceptLoading };
};

export default useKnockHandler;
