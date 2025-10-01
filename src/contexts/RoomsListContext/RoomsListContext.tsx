import { Room } from 'matrix-js-sdk/src';
import { createContext, PropsWithChildren, useState } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useMatrixRoomsSearch from 'hooks/useMatrixRoomsSearch';
import { SetState } from 'utils/types';

import { getFilteredRooms, RoomFilter } from './utils';

interface RoomsListContextType {
  activeRooms: Room[];
  inactiveRooms: Room[];
  endedRooms: Room[];
  resetSearch: () => void;
  setSearchValue: SetState<string>;
  roomFilter: RoomFilter;
  setRoomFilter: SetState<RoomFilter>;
  searchValue: string;
}

export const RoomsListContext = createContext<RoomsListContextType | null>(
  null
);

const RoomsListProvider = ({ children }: PropsWithChildren) => {
  const { matrixClient } = useMatrixContext();
  const { searchValue, foundRooms, resetSearch, setSearchValue } =
    useMatrixRoomsSearch();
  const [roomFilter, setRoomFilter] = useState(RoomFilter.ALL);

  const { activeRooms, inactiveRooms, endedRooms } = getFilteredRooms(
    matrixClient,
    foundRooms
  );

  return (
    <RoomsListContext.Provider
      value={{
        activeRooms,
        inactiveRooms,
        endedRooms,
        resetSearch,
        searchValue,
        setSearchValue,
        roomFilter,
        setRoomFilter,
      }}
    >
      {children}
    </RoomsListContext.Provider>
  );
};

export default RoomsListProvider;
