import { useContext } from 'react';

import { SimpleRoomContext } from './SimpleRoomContext';

export function useSimpleRoomContext() {
  const context = useContext(SimpleRoomContext);
  if (!context)
    throw new Error(
      'useSimpleRoomContext must be used within a SimpleRoomProvider'
    );

  return context;
}
