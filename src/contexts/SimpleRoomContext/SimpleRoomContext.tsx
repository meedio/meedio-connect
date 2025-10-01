import { Room } from 'livekit-client';
import { createContext, PropsWithChildren, useMemo } from 'react';

export type SimpleRoomContextType = {
  room: Room;
};

export const SimpleRoomContext = createContext<SimpleRoomContextType | null>(
  null
);

export const SimpleRoomProvider = ({ children }: PropsWithChildren) => {
  const room = useMemo(() => {
    const r = new Room();
    return r;
  }, []);

  return (
    <SimpleRoomContext.Provider value={{ room }}>
      {children}
    </SimpleRoomContext.Provider>
  );
};
