import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';

const useIsRoomOwner = () => {
  const { matrixClient } = useMatrixContext();
  const { mxRtcSession } = useRoomStateContext();

  if (!mxRtcSession) throw new Error('Unable to check if user is room owner, mxRtcSession is undefined');

  const mxUserId = matrixClient.getUserId();
  const isOwner = !!mxUserId && mxRtcSession.room.getMember(mxUserId)?.powerLevel === 100;

  return isOwner;
};

export default useIsRoomOwner;
