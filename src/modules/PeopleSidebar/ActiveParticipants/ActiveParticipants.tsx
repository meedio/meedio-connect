import { useModal } from '@ebay/nice-modal-react';
import { useRoomContext } from '@livekit/components-react';
import { RemoteParticipant, RoomEvent } from 'livekit-client';
import { useEffect, useRef } from 'react';

import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';

import ActiveParticipant from './ActiveParticipant';
import SidebarActionConfirmationModal from '../SidebarActionConfirmationModal';
import { getSidebarParticipants } from '../utils';

const ActiveParticipants = () => {
  const room = useRoomContext();
  const { mxRtcSession } = useRoomStateContext();
  const openedModalParticipantIdentityRef = useRef<string | null>(null);
  const { hide, remove, visible } = useModal(SidebarActionConfirmationModal);

  const sfuIdentities = [room.localParticipant.identity, ...Array.from(room.remoteParticipants.keys())];
  const participants = getSidebarParticipants(sfuIdentities, mxRtcSession?.room);

  const resetRef = () => (openedModalParticipantIdentityRef.current = null);

  useEffect(() => {
    const handleCloseModal = (participant: RemoteParticipant) => {
      if (openedModalParticipantIdentityRef.current !== participant.identity) return;

      hide().finally(() => {
        remove();
        openedModalParticipantIdentityRef.current = null;
      });
    };

    room.on(RoomEvent.ParticipantDisconnected, handleCloseModal);

    return () => {
      room.off(RoomEvent.ParticipantDisconnected, handleCloseModal);
    };
  }, [hide, remove, room, visible]);

  return (
    <>
      {participants.map(({ identity, matrixUserId, name }) => (
        <ActiveParticipant
          identity={identity}
          matrixUserId={matrixUserId}
          openedModalParticipantIdentityRef={openedModalParticipantIdentityRef}
          resetRef={resetRef}
          name={name}
          key={matrixUserId}
        />
      ))}
    </>
  );
};

export default ActiveParticipants;
