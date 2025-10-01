import { create, useModal } from '@ebay/nice-modal-react';
import { t } from 'i18next';
import { KnownMembership } from 'matrix-js-sdk/src';
import React, { useState } from 'react';

import { ReactComponent as ArrowBack } from 'assets/icons/ArrowBack.svg';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';

import ConfirmationPopup from './ConfirmationPopup/ConfirmationPopup';

type LeaveRoomModalProps = {
  roomId: string;
};

const LeaveRoomModal = create(({ roomId }: LeaveRoomModalProps) => {
  const { remove } = useModal(LeaveRoomModal);
  const [isLoading, setIsLoading] = useState(false);
  const { matrixClient } = useMatrixContext();

  const handleDeleteRoom = async () => {
    setIsLoading(true);
    const room = matrixClient.getRoom(roomId);
    const hasLeftRoom = room?.getMyMembership() === KnownMembership.Leave;

    if (!hasLeftRoom) await matrixClient.leave(roomId);

    setIsLoading(false);
    remove();
  };

  return (
    <ConfirmationPopup onClose={remove} isVisible>
      <ConfirmationPopup.Content icon={ArrowBack} iconClassName="text-tertiary-50">
        {t('leave_room_explanation')}
      </ConfirmationPopup.Content>
      <ConfirmationPopup.Footer>
        <ConfirmationPopup.Button variant="secondaryTertiary" onClick={remove}>
          {t('cancel')}
        </ConfirmationPopup.Button>
        <ConfirmationPopup.Button variant="destructive" onClick={handleDeleteRoom} loading={isLoading}>
          {t('leave')}
        </ConfirmationPopup.Button>
      </ConfirmationPopup.Footer>
    </ConfirmationPopup>
  );
});

export default LeaveRoomModal;
