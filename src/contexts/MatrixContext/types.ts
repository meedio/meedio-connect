import { MatrixClient } from 'matrix-js-sdk/src/client';
import type { Room } from 'matrix-js-sdk/src/matrix';
import { MutableRefObject } from 'react';

import { SetValue } from 'hooks/useCookies';
import { SetState } from 'utils/types';

import { MatrixLoggingInStatusEnum } from './utils';

export type InitialMatrixContextType = {
  matrixClient: MutableRefObject<MatrixClient | null>;
  matrixLoggingInStatus: MatrixLoggingInStatusEnum;
  setMatrixLoggingInStatus: SetState<MatrixLoggingInStatusEnum>;
  rooms: Room[];
  setRooms: SetState<Room[]>;
  isRoomsLoading: boolean;
  setIsRoomsLoading: SetState<boolean>;
  setMatrixUrl: SetValue<string>;
  matrixUrl: string;
  matrixHomeserverBaseUrl: string;
  setMatrixHomeserverBaseUrl: SetValue<string>;
  loginUrl: string;
  setLoginUrl: SetValue<string>;
  clearLoginUrl: () => void | undefined;
  mxAvatarUrl: string;
  setMxAvatarUrl: SetState<string>;
};

export type MatrixContextType = Omit<InitialMatrixContextType, 'matrixClient'> & {
  matrixClient: MatrixClient;
};
