import { SidebarTab } from 'modules/PeopleSidebar/utils';
import { GetActionTypes } from 'utils/reducer/actions';

import { roomUIActions } from './RoomUIContext';

export enum RoomSidebars {
  USERS = 'USERS',
}

export type UsersSidebar = {
  type: RoomSidebars.USERS;
  tab: SidebarTab;
};

export type RoomSidebar = UsersSidebar;

export interface RoomUIState {
  isExternalFullScreen: boolean;
  isHeaderAndFooterShown: boolean;
  isHeaderVisible: boolean;
  isFooterVisible: boolean;
  isSpotlightSidebarVisible: boolean;
  isHeaderRevealDisabled: boolean;
  isScreenTilesVisible: boolean;
  activeSidebar: RoomSidebar | null;
  shouldAnimateSidebar: boolean;
  isLocalViewFloating: boolean;
  isLocalViewFloatingEnabled: boolean;
}

export interface RoomUIContextType {
  state: RoomUIState;
  actions: typeof roomUIActions;
  dispatch: React.Dispatch<GetActionTypes<typeof roomUIActions>>;
}
