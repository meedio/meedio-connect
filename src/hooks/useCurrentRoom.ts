import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';

const useCurrentRoom = () => {
  const { activeRoomId: roomId } = useRoomStateContext();
  const { matrixClient } = useMatrixContext();

  const room = matrixClient.getRoom(roomId);

  return room;
};

export default useCurrentRoom;
