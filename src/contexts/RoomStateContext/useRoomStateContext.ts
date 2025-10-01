import { useContext } from 'react';

import { RoomStateContext } from './RoomStateContext';

const useRoomStateContext = () => {
  const context = useContext(RoomStateContext);

  if (!context) throw new Error('useRoomStateContext must be used within a RoomStateContextProvider');

  return context;
};

export default useRoomStateContext;
