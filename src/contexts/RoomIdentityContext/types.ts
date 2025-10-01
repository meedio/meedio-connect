import { GetActionTypes } from 'utils/reducer/actions';

import { actions } from './RoomIdentityProvider';

export interface InitialRoomIdentityState {
  roomName: string;
  hasWaitingList: boolean;
  isStarted: boolean;
  roomId?: string;
  roomAlias?: string;
  roomDescription?: string;
  startDate?: string;
}

export interface RoomIdentityState extends InitialRoomIdentityState {
  roomId: string;
}

export interface RoomIdentityContextType {
  state: RoomIdentityState;
  actions: typeof actions;
  dispatch: React.Dispatch<GetActionTypes<typeof actions>>;
}
