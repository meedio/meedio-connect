import { KnownMembership } from 'matrix-js-sdk/src';
import { useParams } from 'react-router-dom';

import { getInvitationDetails } from 'api/identityService/getInvitationDetails';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import { useRoomMembershipContext } from 'contexts/RoomMembershipContext/useRoomMembershipContext';
import { JoinErrorEnum } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import useJoinActiveMeeting from 'hooks/useJoinActiveMeeting/useJoinActiveMeeting';
import useJoinMatrixRoom from 'hooks/useJoinMatrixRoom';
import useRoomKnock from 'hooks/useRoomKnock';
import logger from 'utils/logging/faro';

import { BAN_ERROR_MESSAGE, KNOCK_ERROR_MESSAGE, NOT_INVITED_ERROR_MESSAGE } from './utils';

const usePreRoomFormJoin = () => {
  const { matrixClient } = useMatrixContext();
  const { inviteToken } = useParams();
  const { currentMembership } = useRoomMembershipContext();
  const { setJoinError } = useSfuConnectionStateContext();
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const joinMatrixRoom = useJoinMatrixRoom();
  const joinActiveMeeting = useJoinActiveMeeting();
  const knock = useRoomKnock();

  const knockRoom = (shouldSkipJoinOnFail?: boolean) => {
    setJoinError(undefined);
    return knock(shouldSkipJoinOnFail).catch((error) => {
      if (error.message.includes(KNOCK_ERROR_MESSAGE)) return setJoinError(JoinErrorEnum.NOT_INVITED);
      if (error.message.includes(BAN_ERROR_MESSAGE)) return setJoinError(JoinErrorEnum.BANNED);
      setJoinError(JoinErrorEnum.UNKNOWN);
    });
  };

  const joinRoom = async () => {
    setJoinError(undefined);

    if (currentMembership === KnownMembership.Join) {
      const room = matrixClient.getRoom(roomId);
      if (room) return joinActiveMeeting(room).catch(() => setJoinError(JoinErrorEnum.UNKNOWN));
    }

    if (inviteToken) {
      const myId = matrixClient.getUserId();
      const data = await getInvitationDetails(inviteToken, myId || '');

      if (!data.third_party_signed) {
        logger.error('No third_party_signed payload was received from identity service', data);
        return setJoinError(JoinErrorEnum.UNKNOWN);
      }

      return joinMatrixRoom({ third_party_signed: data.third_party_signed })?.catch((error) => {
        if (error.message.includes(NOT_INVITED_ERROR_MESSAGE)) return setJoinError(JoinErrorEnum.NOT_INVITED);
        if (error.message.includes(BAN_ERROR_MESSAGE)) return setJoinError(JoinErrorEnum.BANNED);
        setJoinError(JoinErrorEnum.UNKNOWN);
      });
    }

    return joinMatrixRoom()?.catch((error) => {
      if (error.message.includes(NOT_INVITED_ERROR_MESSAGE)) return knockRoom(true);
      if (error.message.includes(BAN_ERROR_MESSAGE)) return setJoinError(JoinErrorEnum.BANNED);
      setJoinError(JoinErrorEnum.UNKNOWN);
    });
  };

  return { joinRoom, knockRoom };
};

export default usePreRoomFormJoin;
