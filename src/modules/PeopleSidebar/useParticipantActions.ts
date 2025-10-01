import { useModal } from '@ebay/nice-modal-react';
import { useCallback, useState } from 'react';

import useManageMatrixRoomUsers from 'hooks/useManageMatrixRoomUsers';

import SidebarActionConfirmationModal from './SidebarActionConfirmationModal';

interface UseParticipantActionsProps {
  matrixUserId: string;
  identity?: string;
  openedModalParticipantIdentityRef?: React.MutableRefObject<string | null>;
  resetRef?: () => void;
  name?: string;
}

const useParticipantActions = ({
  identity,
  matrixUserId,
  resetRef,
  openedModalParticipantIdentityRef,
  name,
}: UseParticipantActionsProps) => {
  const { show } = useModal(SidebarActionConfirmationModal);
  const { kick, ban, accept } = useManageMatrixRoomUsers();
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);

  const openKickModal = useCallback(() => {
    if (openedModalParticipantIdentityRef && identity) openedModalParticipantIdentityRef.current = identity;
    show({
      onClick: () => kick(matrixUserId),
      actionType: 'kick',
      participantName: name,
      onClose: resetRef,
    });
  }, [identity, name, resetRef, show, openedModalParticipantIdentityRef, kick, matrixUserId]);

  const openBanModal = useCallback(() => {
    if (openedModalParticipantIdentityRef && identity) openedModalParticipantIdentityRef.current = identity;
    show({
      onClick: () => ban(matrixUserId),
      actionType: 'ban',
      participantName: name,
      onClose: resetRef,
    });
  }, [identity, name, resetRef, show, openedModalParticipantIdentityRef, ban, matrixUserId]);

  const openRejectModal = useCallback(() => {
    show({ onClick: () => kick(matrixUserId), actionType: 'deny', participantName: name });
  }, [name, show, kick, matrixUserId]);

  const acceptParticipant = useCallback(() => {
    setIsAcceptLoading(true);
    // NOTE:Remove the loading state only in the catch block, as there is a delay between the request response
    // and the membership event that removes the participant from the waiting list UI
    accept(matrixUserId).catch(() => setIsAcceptLoading(false));
  }, [accept, matrixUserId]);

  return { openKickModal, openBanModal, openRejectModal, accept: acceptParticipant, isAcceptLoading };
};

export default useParticipantActions;
