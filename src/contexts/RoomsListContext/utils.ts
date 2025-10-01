import { MatrixClient, Room } from 'matrix-js-sdk/src';

import i18n from 'i18n/config';
import { getCallSessionDetails } from 'modules/RoomsListItem/utils';

export enum RoomFilter {
  ALL = 'all',
  ACTIVE = 'active',
  ENDED = 'ended',
}

export const getRoomFilters = () => [
  { id: RoomFilter.ALL, translation: i18n.t('all_rooms') },
  { id: RoomFilter.ACTIVE, translation: i18n.t('active') },
  { id: RoomFilter.ENDED, translation: i18n.t('ended') },
];

type FilteredRooms = {
  activeRooms: Room[];
  inactiveRooms: Room[];
  endedRooms: Room[];
};

export const getFilteredRooms = (matrixClient: MatrixClient, rooms: Room[]) =>
  rooms.reduce<FilteredRooms>(
    (acc, room) => {
      const { isActive, endedAt, participantsCount } = getCallSessionDetails(
        matrixClient,
        room
      );

      if (isActive && participantsCount) {
        acc.activeRooms.push(room);
      } else {
        acc.inactiveRooms.push(room);
      }

      if (!isActive && endedAt) acc.endedRooms.push(room);

      return acc;
    },
    { activeRooms: [], inactiveRooms: [], endedRooms: [] }
  );
