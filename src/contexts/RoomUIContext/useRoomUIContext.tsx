import { useContext } from 'react';

import { RoomUIContext } from './RoomUIContext';

function useRoomUIContext() {
  const context = useContext(RoomUIContext);
  if (!context) throw new Error('useRoomUIContext must be used within a RoomUIProvider');

  return context;
}

export default useRoomUIContext;
