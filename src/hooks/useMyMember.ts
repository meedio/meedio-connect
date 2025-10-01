import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';

const useMyMember = () => {
  const { activeRoomId: roomId } = useRoomStateContext();
  const { matrixClient } = useMatrixContext();

  const room = matrixClient.getRoom(roomId);

  return room?.getMember(matrixClient.getUserId() || '') || null;
};

export default useMyMember;
