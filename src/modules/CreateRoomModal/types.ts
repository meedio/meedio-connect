import { Room } from 'matrix-js-sdk/src/matrix';

export type CreateRoomProps = {
  alias?: string;
  roomTitle: string;
  isWaitingListEnabled: boolean;
  description?: string;
};

export type UpdateRoomProps = CreateRoomProps & {
  room: Room;
};
