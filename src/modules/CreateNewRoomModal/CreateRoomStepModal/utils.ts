import { Room } from 'matrix-js-sdk/src';
import { getRoomInformationFromIdentityServerById } from 'api/identityService/getRoomInformationFromIdentityServerById';
import {
  CUSTOM_MEEDIO_EVENTS,
  isValidRoomSecretEvent,
} from 'utils/matrixUtils';

export type CreateRoomProps = {
  roomName: string;
  isWaitingListEnabled: boolean;
  roomAlias?: string;
  description?: string;
};

export type UpdateRoomProps = CreateRoomProps & { room: Room };

export const getRoomSecret = (room: Room) => {
  const data = room.getAccountData(CUSTOM_MEEDIO_EVENTS.ROOM_SECRET);
  const content = data?.getContent();

  if (!isValidRoomSecretEvent(content))
    throw new Error('Invalid room secret event');

  return content.roomSecret;
};

export const getInviteInformation = async (room: Room) => {
  const roomSecret = getRoomSecret(room);

  return getRoomInformationFromIdentityServerById(room.roomId, roomSecret);
};

export const generateSecret = (bytes = 32) => {
  const buf = new Uint8Array(bytes);
  window.crypto.getRandomValues(buf);

  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const getFullDateAt = (
  startDate: Date,
  startTime: Date,
  timeZone?: number
) => {
  const combinedDate = new Date(startDate);
  combinedDate.setHours(startTime.getHours());
  combinedDate.setMinutes(startTime.getMinutes());

  if (timeZone) {
    const offsetMinutes = timeZone * 60;
    combinedDate.setMinutes(combinedDate.getMinutes() - offsetMinutes);
  }

  return combinedDate.toISOString();
};
