import { KnownMembership } from 'matrix-js-sdk/src/matrix';
import { useEffect, useRef } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import { useRoomMembershipContext } from 'contexts/RoomMembershipContext/useRoomMembershipContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import { JoinErrorEnum } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import logger from 'utils/logging/faro';
import { Timeout } from 'utils/types';

import useJoinActiveMeeting from './useJoinActiveMeeting';

const JOIN_TIMEOUT_DURATION = 15000;

const useJoinMeetingOnMembership = () => {
  const { shouldJoinMeetingOnRoom, setShouldJoinMeetingOnRoom, setJoinError } = useSfuConnectionStateContext();
  const { currentMembership } = useRoomMembershipContext();
  const { matrixClient } = useMatrixContext();
  const isCurrentlyJoiningRef = useRef(false);
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const joinActiveMeeting = useJoinActiveMeeting();
  const joinTimeoutRef = useRef<Timeout | null>(null);
  const { activeRoomId } = useRoomStateContext();

  // NOTE: timeout to abort the join if the room is not received within 15 seconds
  useEffect(() => {
    if (!shouldJoinMeetingOnRoom) return;

    logger.info(`Join timeout starting, waiting ${JOIN_TIMEOUT_DURATION / 1000} sec for membership update`);
    joinTimeoutRef.current = setTimeout(() => {
      setShouldJoinMeetingOnRoom(false);
      setJoinError(JoinErrorEnum.UNKNOWN);
      logger.error('Join timeout reached, we have not received a membership update, unable to join the meeting');
    }, JOIN_TIMEOUT_DURATION);

    return () => {
      if (joinTimeoutRef.current) {
        clearTimeout(joinTimeoutRef.current);
        joinTimeoutRef.current = null;
        logger.info('Join timeout cleared on unmount');
      }
    };
  }, [setJoinError, setShouldJoinMeetingOnRoom, shouldJoinMeetingOnRoom]);

  // NOTE: joins the meeting when a join membership is received, should help to avoid race conditions
  useEffect(() => {
    const isMainRoom = activeRoomId === roomId;
    const isJoinMembership = currentMembership === KnownMembership.Join;
    if (!isMainRoom || !shouldJoinMeetingOnRoom || !isJoinMembership || isCurrentlyJoiningRef.current) {
      return;
    }

    if (joinTimeoutRef.current) {
      clearTimeout(joinTimeoutRef.current);
      joinTimeoutRef.current = null;
      logger.info('Join timeout cleared because we received a join membership');
    }

    const room = matrixClient.getRoom(roomId);
    if (!room) {
      setShouldJoinMeetingOnRoom(false);
      setJoinError(JoinErrorEnum.UNKNOWN);
      logger.error('Failed to join the meeting after receiving join membership, room was not found');
      return;
    }

    isCurrentlyJoiningRef.current = true;
    joinActiveMeeting(room)
      .catch((e) => logger.error('Error in joinActiveMeeting', e))
      .finally(() => {
        setShouldJoinMeetingOnRoom(false);
        isCurrentlyJoiningRef.current = false;
      });
  }, [
    activeRoomId,
    currentMembership,
    joinActiveMeeting,
    matrixClient,
    roomId,
    setJoinError,
    setShouldJoinMeetingOnRoom,
    shouldJoinMeetingOnRoom,
  ]);
};

export default useJoinMeetingOnMembership;
