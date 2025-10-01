import { useState } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';

const useMatrixRoomsSearch = () => {
  const { rooms } = useMatrixContext();
  const [searchValue, setSearchValue] = useState('');

  const resetSearch = () => setSearchValue('');

  const foundRooms = !searchValue
    ? rooms
    : rooms.filter((room) => room.name.toLowerCase().includes(searchValue.toLowerCase()));

  return { searchValue, foundRooms, setSearchValue, resetSearch };
};

export default useMatrixRoomsSearch;
