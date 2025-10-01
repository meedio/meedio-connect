import { useRoomContext } from '@livekit/components-react';
import { DisconnectReason, RoomEvent } from 'livekit-client';
import { ClientEvent, MatrixEvent } from 'matrix-js-sdk/src';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import { MatrixToDeviceEvents } from 'utils/Constants';
import logger from 'utils/logging/faro';
import { getCleanPathname } from 'utils/utils';

enum RoomEndedRoutes {
  END = 'end',
  TERMINATED = 'terminated',
}

const useHandleSfuDisconnect = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const room = useRoomContext();
  const { matrixClient } = useMatrixContext();

  const navigateFromRoom = useCallback(
    (to: RoomEndedRoutes, reason: string) => {
      navigate(`${getCleanPathname()}/${to}${location.search}`, { state: { reason } });
    },
    [location.search, navigate]
  );

  useEffect(() => {
    const handleDisconnect = (reason: DisconnectReason | undefined) => {
      if (reason === DisconnectReason.ROOM_DELETED) {
        navigateFromRoom(RoomEndedRoutes.TERMINATED, t('room_has_been_terminated'));
      }
      if (reason === DisconnectReason.DUPLICATE_IDENTITY) {
        navigateFromRoom(RoomEndedRoutes.END, t('duplicate_room_join_detected'));
      }
    };

    const handleDuplicateJoin = (event: MatrixEvent) => {
      const isDuplicateJoinEvent = event.getType() === MatrixToDeviceEvents.ROOM_DUPLICATE_JOIN;
      if (!isDuplicateJoinEvent) return;

      // NOTE: matrix roomId is same as livekit room name
      const isCorrectRoom = event.getContent().roomId === room.name;
      if (isCorrectRoom) {
        logger.info('Disconnecting from the room, reason: duplicate join');
        navigateFromRoom(RoomEndedRoutes.END, t('duplicate_room_join_detected'));
      }
    };

    room.on(RoomEvent.Disconnected, handleDisconnect);
    matrixClient.on(ClientEvent.ToDeviceEvent, handleDuplicateJoin);

    return () => {
      room.off(RoomEvent.Disconnected, handleDisconnect);
      matrixClient.off(ClientEvent.ToDeviceEvent, handleDuplicateJoin);
    };
  }, [navigateFromRoom, room, t, matrixClient]);
};

export default useHandleSfuDisconnect;
