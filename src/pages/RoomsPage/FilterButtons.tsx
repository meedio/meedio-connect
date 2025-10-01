import Chip from 'components/Chip/Chip';
import useRoomsListContext from 'contexts/RoomsListContext/useRoomsListContext';
import { getRoomFilters, RoomFilter } from 'contexts/RoomsListContext/utils';

const FilterButtons = () => {
  const { roomFilter, setRoomFilter, activeRooms } = useRoomsListContext();

  const filters = getRoomFilters();

  // NOTE: only active will have a badge for now
  const roomCounts = {
    [RoomFilter.ALL]: undefined,
    [RoomFilter.ACTIVE]: activeRooms.length,
    [RoomFilter.ENDED]: undefined,
  };

  return (
    <div className='grid grid-cols-2 sm:flex gap-1 sm:gap-2'>
      {filters.map(({ id, translation }) => (
        <Chip
          key={id}
          onClick={() => setRoomFilter(id)}
          isActive={roomFilter === id}
          badgeValue={roomCounts[id]}
        >
          {translation}
        </Chip>
      ))}
    </div>
  );
};

export default FilterButtons;
