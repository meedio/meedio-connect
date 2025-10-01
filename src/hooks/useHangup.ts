import { useModal } from '@ebay/nice-modal-react';
import { setupDisconnectButton } from '@livekit/components-core';
import { useMaybeRoomContext } from '@livekit/components-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import HangupConfirmPopup from 'components/HangupConfirmPopup';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import { getCleanPathname } from 'utils/utils';

const useHangup = () => {
  const navigate = useNavigate();
  const [param] = useSearchParams();
  const room = useMaybeRoomContext();
  const hangupConfirmPopup = useModal(HangupConfirmPopup);
  const navigateRoute = `${getCleanPathname()}/end?${param}`;
  const {
    state: { roomId, roomName },
  } = useRoomIdentityContext();

  const navigateToEnded = () => {
    if (room) setupDisconnectButton(room).disconnect();

    return navigate(navigateRoute, { state: { matrixRoomId: roomId } });
  };

  const openHangupModal = () => hangupConfirmPopup.show({ onConfirm: navigateToEnded, roomName });

  return openHangupModal;
};

export default useHangup;
