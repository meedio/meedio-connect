import { JoinRule, MatrixClient } from 'matrix-js-sdk/src';

import { getInvitationDetails } from 'api/identityService/getInvitationDetails';
import { getRoomInformationFromIdentityServerByAlias } from 'api/identityService/getRoomInformationFromIdentityServerByAlias';
import { getRoomInformationFromIdentityServerById } from 'api/identityService/getRoomInformationFromIdentityServerById';
import { extractAlias } from 'modules/CreateNewRoomModal/CreateNewRoomDataProvider/utils';
import { getRoomMetadata } from 'modules/RoomsListItem/utils';
import logger from 'utils/logging/faro';

import { InitialRoomIdentityState, RoomIdentityState } from './types';

export enum IdentityRetrieveStatus {
  INITIAL = 'Initial',
  LOADING = 'Loading',
  SUCCESS = 'Success',
  ERROR = 'Error',
}

export const defaultIdentityState: InitialRoomIdentityState = {
  roomName: '',
  roomDescription: '',
  hasWaitingList: false,
  isStarted: false,
};

/**
 * Attaches the home server to the alias.
 * @param alias - The alias (Our version of it, alias-1234)
 * @param roomId - The room ID to extract the home server from.
 * @returns Formatted alias (#alias-1234:matrix..).
 */
export const attachHomeServerToAlias = (alias: string, roomId: string) => {
  const homeserver = roomId.split(':')[1];
  return `#${alias}:${homeserver}`;
};

export const hasRoomIdInIdentityState = (
  state: InitialRoomIdentityState
): state is RoomIdentityState => !!state.roomId;
export interface HandleRoomIdentityProps {
  matrixClient: MatrixClient;
  onSuccess: (roomIdentityState: Partial<RoomIdentityState>) => void;
  onFail: () => void;
}

export const handleRoomIdentityUsingIdOrAlias = async ({
  matrixClient,
  roomIdOrAlias,
  onSuccess,
  onFail,
}: HandleRoomIdentityProps & { roomIdOrAlias: string }) => {
  const isRoomId = roomIdOrAlias.at(0) === '!';

  if (isRoomId) {
    const roomId = roomIdOrAlias;
    const room = matrixClient.getRoom(roomId);
    if (room) {
      logger.info(
        'Participant has matrix room, so we will use it for identity info'
      );
      const hasWaitingList = room.getJoinRule() === JoinRule.Knock;
      const { description } = getRoomMetadata(room);
      const roomAlias = extractAlias(room.getCanonicalAlias() || '');

      return onSuccess({
        roomId,
        roomAlias,
        hasWaitingList,
        roomName: room.name,
        roomDescription: description || undefined,
      });
    }
  }

  const retrievalFn = isRoomId
    ? getRoomInformationFromIdentityServerById
    : getRoomInformationFromIdentityServerByAlias;

  retrievalFn(roomIdOrAlias)
    .then(
      ({ room_id, room_alias, room_description, room_name, waiting_list }) =>
        onSuccess({
          hasWaitingList: waiting_list,
          roomId: room_id,
          roomDescription: room_description || undefined,
          roomName: room_name,
          roomAlias: room_alias,
        })
    )
    .catch((error) => {
      logger.error('Error fetching room identity:', { roomIdOrAlias, error });
      onFail();
    });
};

export const handleRoomIdentityUsingToken = ({
  matrixClient,
  inviteToken,
  onSuccess,
  onFail,
}: HandleRoomIdentityProps & { inviteToken: string }) => {
  const userId = matrixClient.getUserId();
  if (!inviteToken || !userId) {
    logger.error('Reached invite token flow without invite token or userId', {
      inviteToken,
      userId,
    });
    return onFail();
  }

  getInvitationDetails(inviteToken, userId)
    .then((response) => {
      const { id, name, alias, waiting_list, description } = response.room;
      onSuccess({
        roomId: id,
        roomName: name,
        roomAlias: alias || undefined,
        hasWaitingList: waiting_list,
        roomDescription: description || undefined,
      });
    })
    .catch((error) => {
      logger.error('Error fetching invitation details:', {
        inviteToken,
        error,
      });
      onFail();
    });
};
