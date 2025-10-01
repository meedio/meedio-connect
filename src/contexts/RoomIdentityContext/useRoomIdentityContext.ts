import { useContext } from 'react';

import { RoomIdentityContext } from './RoomIdentityProvider';

const useRoomIdentityContext = () => {
  const context = useContext(RoomIdentityContext);
  if (!context) throw new Error('useRoomIdentityContext must be used within RoomIdentityProvider');

  return context;
};

export default useRoomIdentityContext;
