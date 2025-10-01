import { LiveKitRoom } from '@livekit/components-react';
import { ConnectionState, RoomEvent } from 'livekit-client';
import { useEffect } from 'react';

import { useSimpleRoomContext } from 'contexts/SimpleRoomContext/useSimpleRoomContext';
import ModalProvider from 'contexts/ModalProvider/ModalProvider';
import useOpenIdSfuContext from 'contexts/OpenIdSfuContext/useOpenIdSfuContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import { ConnectionStatus } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import useHandleLivekitRoomErrors from 'hooks/useHandleLivekitRoomErrors';
import useTracksPublish from 'hooks/useTracksPublish';
import ActiveRoom from 'modules/ActiveRoom/ActiveRoom';
import PreRoom from 'modules/PreRoom/PreRoom';
import { Timeout } from 'utils/types';

import RoomConnectWrapper from './RoomConnectWrapper';
import { logConnectionMethod } from './utils';

const Room = () => {
  const { mxRtcSession } = useRoomStateContext();
  const { room } = useSimpleRoomContext();
  const { sfuConfig, error } = useOpenIdSfuContext();
  const { setConnectionStatus, connectionStatus } =
    useSfuConnectionStateContext();
  const handleRoomErrors = useHandleLivekitRoomErrors();
  const publishTracks = useTracksPublish(room);

  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;

  const onConnected = () => {
    publishTracks();
    setConnectionStatus(ConnectionStatus.CONNECTED);
  };

  useEffect(() => {
    let timeout: Timeout | null = null;

    // NOTE: we need to wait for the connection and ice candidates to settle
    const handleConnectionEvent = (state: ConnectionState) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => logConnectionMethod(room, state), 2000);
    };

    room.on(RoomEvent.ConnectionStateChanged, handleConnectionEvent);

    return () => {
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionEvent);
      if (timeout) clearTimeout(timeout);
    };
  }, [room]);

  if (!isConnected || !mxRtcSession || !sfuConfig) {
    return <PreRoom error={error} />;
  }

  return (
    <LiveKitRoom
      room={room}
      token={sfuConfig.jwt}
      serverUrl={sfuConfig.url}
      connect
      connectOptions={{ autoSubscribe: true }}
      onConnected={onConnected}
      onError={handleRoomErrors}
      onDisconnected={() => setConnectionStatus(ConnectionStatus.DISCONNECTED)}
    >
      <RoomConnectWrapper>
        <ModalProvider>
          <ActiveRoom />
        </ModalProvider>
      </RoomConnectWrapper>
    </LiveKitRoom>
  );
};

export default Room;
