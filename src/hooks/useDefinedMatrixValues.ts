import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';

const useDefinedMatrixValues = () => {
  const { activeRoomId: roomId } = useRoomStateContext();
  const { matrixClient } = useMatrixContext();
  const { mxRtcSession } = useRoomStateContext();

  if (!mxRtcSession) throw new Error('mxRtcSession is missing in useDefinedMatrixValues');

  const matrixRoom = matrixClient.getRoom(roomId);
  if (!matrixRoom) throw new Error('Room is missing in useDefinedMatrixValues');

  return { mxRtcSession, matrixRoom, roomId };
};

export default useDefinedMatrixValues;
