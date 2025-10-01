import { Room } from 'matrix-js-sdk/src';
import { useTranslation } from 'react-i18next';

import ListSection from 'components/ListSection';
import useRoomsListContext from 'contexts/RoomsListContext/useRoomsListContext';
import { RoomFilter } from 'contexts/RoomsListContext/utils';
import RoomsList from 'modules/RoomsList/RoomsList';

interface Section {
  rooms: Room[];
  label?: string;
  isPaginated?: boolean;
  roomCount?: number;
  filter?: RoomFilter;
}

const Rooms = () => {
  const { t } = useTranslation();
  const { activeRooms, inactiveRooms, endedRooms, roomFilter, searchValue } =
    useRoomsListContext();

  const activeRoomsSection = activeRooms.length
    ? [
        {
          rooms: activeRooms,
          label: t('active'),
          roomCount: 3,
          filter: RoomFilter.ACTIVE,
        },
      ]
    : [];
  const inactiveRoomsSection = inactiveRooms.length
    ? [{ rooms: inactiveRooms, isPaginated: true }]
    : [];

  const sections: Record<RoomFilter, Section[]> = {
    [RoomFilter.ALL]: [...activeRoomsSection, ...inactiveRoomsSection],
    [RoomFilter.ACTIVE]: [{ rooms: activeRooms, isPaginated: true }],
    [RoomFilter.ENDED]: [{ rooms: endedRooms, isPaginated: true }],
  };

  const isListEmpty = sections[roomFilter].every(({ rooms }) => !rooms.length);

  return (
    <ListSection isEmpty={isListEmpty}>
      {sections[roomFilter].map(
        ({ rooms, label, isPaginated, roomCount, filter }, index) => (
          <RoomsList
            key={searchValue + roomFilter + index}
            roomsList={rooms}
            label={label}
            isPaginated={isPaginated}
            itemsPerPage={roomCount}
            filter={filter}
          />
        )
      )}
    </ListSection>
  );
};

export default Rooms;
