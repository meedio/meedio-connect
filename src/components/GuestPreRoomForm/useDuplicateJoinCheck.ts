import { useModal } from '@ebay/nice-modal-react';
import { CallMembership } from 'matrix-js-sdk/src/matrixrtc/CallMembership';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import RoomDuplicateJoinPopup from 'components/RoomDuplicateJoinPopup';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useMxCookies from 'modules/Authentication/hooks/useMxCookies';

type UseDuplicateJoinCheckProps = {
  handleClickWithLoading: () => void;
  handleSubmit: (fn: () => void) => () => void;
};

export function useDuplicateJoinCheck({ handleClickWithLoading, handleSubmit }: UseDuplicateJoinCheckProps) {
  const { matrixClient } = useMatrixContext();
  const { mxLoggedIn } = useMxCookies();
  const { roomId } = useParams();
  const { show } = useModal(RoomDuplicateJoinPopup);

  const handleJoin = useCallback(() => {
    const room = matrixClient.getRoom(roomId);

    if (room && mxLoggedIn) {
      const memberships: CallMembership[] = matrixClient.matrixRTC.getActiveRoomSession(room)?.memberships || [];
      const session = memberships.find(({ sender }) => sender === matrixClient.getUserId());
      if (session) return show({ handleJoinRoom: handleSubmit(handleClickWithLoading), room, session });
    }

    handleSubmit(handleClickWithLoading)();
  }, [matrixClient, roomId, mxLoggedIn, show, handleSubmit, handleClickWithLoading]);

  return handleJoin;
}
