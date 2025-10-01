import { RoomMember } from 'matrix-js-sdk/src/matrix';
import { createContext, PropsWithChildren } from 'react';

import clip from 'assets/sounds/meedioNotification.mp3';
import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import useSound from 'hooks/useSound/useSound';

import useWaitingListMembers from './useWaitingListMembers';
import useWaitingListStatus from './useWaitingListStatus';

export type WaitingListContextType = {
  waitingListMembers: RoomMember[];
  isWaitingListEnabled: boolean;
};

export const WaitingListContext = createContext<WaitingListContextType | null>(null);

export const WaitingListProvider = ({ children }: PropsWithChildren) => {
  const {
    state: { roomId },
  } = useRoomIdentityContext();
  const { audioOutputId } = useLiveKitDevicesStateContext();
  const { playSound } = useSound(clip, audioOutputId);
  const isWaitingListEnabled = useWaitingListStatus();
  const waitingListMembers = useWaitingListMembers({ playSound, roomId });

  return (
    <WaitingListContext.Provider value={{ waitingListMembers, isWaitingListEnabled }}>
      {children}
    </WaitingListContext.Provider>
  );
};
