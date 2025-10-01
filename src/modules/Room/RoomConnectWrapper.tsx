import { useConnectionState } from '@livekit/components-react';
import { PropsWithChildren } from 'react';

import useHandleSfuDisconnect from 'hooks/useHandleSfuDisconnect';
import useHandleSfuReconnection from 'hooks/useHandleSfuReconnection';
import useMatrixMeetingRoomEvents from 'hooks/useMatrixMeetingEvents';
import useSfuCleanUp from 'hooks/useSfuCleanUp';
import { getIsConnectedToSfu } from 'utils/utils';

import JoiningScreen from './JoiningScreen';

const RoomConnectWrapper = ({ children }: PropsWithChildren) => {
  const connectionState = useConnectionState();
  useHandleSfuDisconnect();
  useHandleSfuReconnection();
  useSfuCleanUp();
  useMatrixMeetingRoomEvents();

  if (!getIsConnectedToSfu(connectionState)) return <JoiningScreen />;

  return children;
};

export default RoomConnectWrapper;
