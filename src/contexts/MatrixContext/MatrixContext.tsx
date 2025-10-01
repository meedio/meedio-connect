import UnexpectedError from '@shared/components/ErrorBoundaryComponent/UnexpectedError/UnexpectedError';
import { MatrixClient } from 'matrix-js-sdk/src/client';
import type { Room } from 'matrix-js-sdk/src/matrix';
import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react';

import LoadingScreen from 'components/LoadingScreen/LoadingScreen';
import useLocalStorage from 'hooks/useLocalStorage/useLocalStorage';
import constants from 'utils/Constants';
import logger from 'utils/logging/faro';

import { InitialMatrixContextType, MatrixContextType } from './types';
import useInitializeMatrix from './useInitializeMatrix';
import { MatrixLoggingInStatusEnum } from './utils';

export const MatrixContext = createContext<MatrixContextType | null>(null);

export const MatrixProvider = ({ children }: PropsWithChildren) => {
  const matrixClient = useRef<MatrixClient | null>(null);
  const [matrixLoggingInStatus, setMatrixLoggingInStatus] = useState(MatrixLoggingInStatusEnum.INITIAL);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isRoomsLoading, setIsRoomsLoading] = useState(true);
  const [mxAvatarUrl, setMxAvatarUrl] = useState('');
  const [matrixUrl, setMatrixUrl] = useLocalStorage(constants.MATRIX_URL, import.meta.env.REACT_APP_MATRIX_URL);
  // NOTE: Base URL is saved for calling homeserver without needing to query ./well-known all the time from the matrixUrl
  const [matrixHomeserverBaseUrl, setMatrixHomeserverBaseUrl] = useLocalStorage(
    constants.MATRIX_HOMESERVER_BASE_URL,
    import.meta.env.REACT_APP_MATRIX_URL
  );
  // If during authentication in MAS user reclaims tab and resets local mx url's, after authentication succeeds we preserve login url so we set it to correct one
  const [loginUrl, setLoginUrl, clearLoginUrl] = useLocalStorage<string>(
    constants.MATRIX_LOGIN_URL,
    import.meta.env.REACT_APP_MATRIX_URL,
    true
  );

  const initialMatrixContextValue: InitialMatrixContextType = {
    matrixClient,
    matrixLoggingInStatus,
    setMatrixLoggingInStatus,
    rooms,
    setRooms,
    isRoomsLoading,
    setIsRoomsLoading,
    matrixUrl,
    setMatrixUrl,
    matrixHomeserverBaseUrl,
    setMatrixHomeserverBaseUrl,
    mxAvatarUrl,
    setMxAvatarUrl,
    loginUrl,
    setLoginUrl,
    clearLoginUrl,
  };

  useInitializeMatrix(initialMatrixContextValue);

  const isLoading = [MatrixLoggingInStatusEnum.INITIAL, MatrixLoggingInStatusEnum.RUNNING].includes(
    matrixLoggingInStatus
  );

  // Unmount matrix client when the matrixProvider unmounts, in tab-lock-release case when SingleTabProvider activates
  // This will help to release lock from indexDB, sync requests, and will gracefully kill it.
  useEffect(
    () => () => {
      matrixClient.current?.stopClient();
      matrixClient.current = null;
    },
    []
  );

  if (isLoading) return <LoadingScreen />;
  if (!matrixClient.current) {
    logger.error('Matrix client is missing, rendering error page');
    return <UnexpectedError />;
  }

  return (
    <MatrixContext.Provider value={{ ...initialMatrixContextValue, matrixClient: matrixClient.current }}>
      {children}
    </MatrixContext.Provider>
  );
};
