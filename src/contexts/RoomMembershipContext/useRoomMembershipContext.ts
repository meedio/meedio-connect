import { useContext } from 'react';

import { RoomMembershipContext } from './RoomMembershipContext';

export function useRoomMembershipContext() {
  const context = useContext(RoomMembershipContext);
  if (!context) throw new Error('useRoomMembershipContext must be used within a RoomMembershipProvider');

  return context;
}
