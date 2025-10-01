import { createContext, MutableRefObject, PropsWithChildren, useCallback, useRef, useState } from 'react';

import { SetState } from 'utils/types';

export enum JoinErrorEnum {
  BANNED = 'banned',
  NOT_INVITED = 'not_invited',
  UNKNOWN = 'unknown',
}

export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}

export type SfuConnectionStateContextType = {
  connectionStatus: ConnectionStatus;
  setConnectionStatus: SetState<ConnectionStatus>;
  token?: string;
  setToken: SetState<string | undefined>;
  isParticipantDisconnectedRef: MutableRefObject<boolean>;
  isParticipantTerminatedRef: MutableRefObject<boolean>;
  clearConnectionState: () => void;
  shouldJoinMeetingOnRoom: boolean;
  setShouldJoinMeetingOnRoom: SetState<boolean>;
  setJoinError: SetState<JoinErrorEnum | undefined>;
  joinError: JoinErrorEnum | undefined;
};

export const SfuConnectionStateContext = createContext<SfuConnectionStateContextType | null>(null);

export const SfuConnectionStateProvider = ({ children }: PropsWithChildren) => {
  const [connectionStatus, setConnectionStatus] = useState(ConnectionStatus.DISCONNECTED);
  const [shouldJoinMeetingOnRoom, setShouldJoinMeetingOnRoom] = useState(false);
  const [joinError, setJoinError] = useState<JoinErrorEnum>();
  const [token, setToken] = useState<string>();
  const isParticipantDisconnectedRef = useRef(false);
  const isParticipantTerminatedRef = useRef(false);

  const clearConnectionState = useCallback(() => {
    setToken(undefined);
  }, []);

  const state: SfuConnectionStateContextType = {
    connectionStatus,
    setConnectionStatus,
    token,
    setToken,
    isParticipantDisconnectedRef,
    isParticipantTerminatedRef,
    clearConnectionState,
    shouldJoinMeetingOnRoom,
    setShouldJoinMeetingOnRoom,
    joinError,
    setJoinError,
  };

  return <SfuConnectionStateContext.Provider value={state}>{children}</SfuConnectionStateContext.Provider>;
};
