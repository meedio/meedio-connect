import { Room } from 'matrix-js-sdk/src';
import { useCallback } from 'react';

import { useSimpleRoomContext } from 'contexts/SimpleRoomContext/useSimpleRoomContext';
import useOpenIdSfuContext from 'contexts/OpenIdSfuContext/useOpenIdSfuContext';
import { ConnectionStatus } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import useEnterRtcSession from 'hooks/useEnterRtcSession';

const useJoinActiveMeeting = () => {
  const { setConnectionStatus } = useSfuConnectionStateContext();
  const { room: livekitRoom } = useSimpleRoomContext();
  const { setError } = useOpenIdSfuContext();
  const enterRtcSession = useEnterRtcSession();

  const joinActiveMeeting = useCallback(
    (room: Room) => {
      setConnectionStatus(ConnectionStatus.CONNECTING);
      enterRtcSession(room);
      setError(undefined);

      return livekitRoom.startAudio();
    },
    [enterRtcSession, livekitRoom, setConnectionStatus, setError]
  );

  return joinActiveMeeting;
};

export default useJoinActiveMeeting;
