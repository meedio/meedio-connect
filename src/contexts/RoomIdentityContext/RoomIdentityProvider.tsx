import { createContext, PropsWithChildren, useEffect, useReducer } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import LoadingScreen from 'components/LoadingScreen/LoadingScreen';
import logger from 'utils/logging/faro';
import { createAction, GetActionTypes } from 'utils/reducer/actions';

import { InitialRoomIdentityState, RoomIdentityContextType, RoomIdentityState } from './types';
import useRoomIdentityRetrieve from './useRoomIdentityRetrieve';
import { defaultIdentityState, hasRoomIdInIdentityState, IdentityRetrieveStatus } from './utils';

export const actions = {
  setValues: (values: Partial<RoomIdentityState>) => createAction('setValues', values),
};

const roomIdentityReducer = (
  state: InitialRoomIdentityState,
  action: GetActionTypes<typeof actions>
): InitialRoomIdentityState => {
  switch (action.type) {
    case 'setValues':
      return { ...state, ...action.payload };
    default: {
      throw new Error(`Unsupported action type: ${action}`);
    }
  }
};

export const RoomIdentityContext = createContext<RoomIdentityContextType | null>(null);

const RoomIdentityProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(roomIdentityReducer, defaultIdentityState);
  const params = useParams();

  const handleIdentityRetrieve = (values: Partial<RoomIdentityState>) => dispatch(actions.setValues(values));
  const { identityRetrieveStatus } = useRoomIdentityRetrieve(handleIdentityRetrieve);

  const isLoading = [IdentityRetrieveStatus.INITIAL, IdentityRetrieveStatus.LOADING].includes(identityRetrieveStatus);

  useEffect(() => () => dispatch(actions.setValues(defaultIdentityState)), [params]);

  if (isLoading) return <LoadingScreen />;
  if (identityRetrieveStatus === IdentityRetrieveStatus.ERROR || !hasRoomIdInIdentityState(state)) {
    logger.error('RoomIdentityProvider: roomId is missing in the state, room was probably not found', { state });
    return <Navigate to="/404" />;
  }

  return <RoomIdentityContext.Provider value={{ state, actions, dispatch }}>{children}</RoomIdentityContext.Provider>;
};

export default RoomIdentityProvider;
