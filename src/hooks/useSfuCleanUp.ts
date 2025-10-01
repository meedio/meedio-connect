import { useRoomContext } from '@livekit/components-react';
import { MutableRefObject, useCallback, useEffect } from 'react';

import constants from 'Constants';
import useEventListener from 'hooks/useEventListener/useEventListener';
import useLocalStorage from 'hooks/useLocalStorage/useLocalStorage';

const useSfuCleanUp = (isParticipantTerminatedRef?: MutableRefObject<boolean>) => {
  const [, setClientId] = useLocalStorage<string | null>(constants.LIVEKIT_CLIENT_ID, null);
  const { disconnect } = useRoomContext();

  const cleanUp = useCallback(() => {
    disconnect();

    // NOTE: return early so terminated participant would not clear client id from local storage
    if (isParticipantTerminatedRef?.current) {
      isParticipantTerminatedRef.current = false;
      return;
    }

    setClientId(null);
  }, [disconnect, isParticipantTerminatedRef, setClientId]);

  // NOTE: disconnecting while room connection state is CONNECTING might throw an error "Client initiated disconnect" which is expected.
  // Disconnection is needed because livekit will add inactive participant if user reloads the page while connecting
  // and will not remove him for 20-30 sec.

  useEventListener('beforeunload', cleanUp);
  useEffect(() => cleanUp, [cleanUp]);
};

export default useSfuCleanUp;
