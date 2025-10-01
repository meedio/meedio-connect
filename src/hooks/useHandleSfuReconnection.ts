import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import { useEffect, useRef } from 'react';

import logger from 'utils/logging/faro';
import { Timeout } from 'utils/types';

import useSfuReconnectionActions from './useSfuReconnectionActions';

// NOTE: We kick participant to prevent him from staying indefinitely.
const TIME_TO_RECONNECT = 1000 * 60 * 2;

const useHandleSfuReconnection = () => {
  const room = useRoomContext();
  const reconnectTimeoutRef = useRef<Timeout>();
  const { displayToast, hideToast, navigateToDisconnected } = useSfuReconnectionActions();

  const clearReconnectionTimeout = () => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
  };

  useEffect(() => {
    const handleReconnecting = () => {
      logger.info('Reconnecting, displaying toast');
      displayToast();
      clearReconnectionTimeout();
      reconnectTimeoutRef.current = setTimeout(navigateToDisconnected, TIME_TO_RECONNECT);
    };

    const handleReconnected = () => {
      logger.info('Reconnected, hiding toast');
      clearReconnectionTimeout();
      hideToast();
    };

    room.on(RoomEvent.Reconnecting, handleReconnecting);
    room.on(RoomEvent.Reconnected, handleReconnected);

    return () => {
      room.off(RoomEvent.Reconnecting, handleReconnecting);
      room.off(RoomEvent.Reconnected, handleReconnected);
      hideToast();
    };
  }, [displayToast, hideToast, navigateToDisconnected, room]);

  useEffect(() => clearReconnectionTimeout, []);
};

export default useHandleSfuReconnection;
