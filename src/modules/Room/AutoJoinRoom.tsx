import { useEffect, useRef } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import useJoinActiveMeeting from 'hooks/useJoinActiveMeeting/useJoinActiveMeeting';
import useLivekitPermissions from 'hooks/useLivekitPermissions/useLivekitPermissions';
import logger from 'utils/logging/faro';

import JoiningScreen from './JoiningScreen';

const AutoJoinRoom = () => {
  const { matrixClient } = useMatrixContext();
  const { activeRoomId: roomId } = useRoomStateContext();
  const joinActiveMeeting = useJoinActiveMeeting();
  const hasJoined = useRef(false);
  const { isPermitted, isPermissionsChecked } = useLivekitPermissions();

  useEffect(() => {
    if (!hasJoined.current && isPermitted && isPermissionsChecked) {
      const room = matrixClient.getRoom(roomId);
      if (!room) return logger.error('Unable to auto-join a room', { roomId });

      hasJoined.current = true;
      joinActiveMeeting(room);
    }
  }, [isPermissionsChecked, isPermitted, joinActiveMeeting, matrixClient, roomId]);

  return <JoiningScreen />;
};

export default AutoJoinRoom;
