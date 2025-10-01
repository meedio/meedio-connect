import { createContext, PropsWithChildren, useReducer } from 'react';

import { SidebarTab } from 'modules/PeopleSidebar/utils';
import { getIsMobile } from 'utils/browsers';
import { createAction, GetActionTypes } from 'utils/reducer/actions';

import { RoomSidebar, RoomSidebars, RoomUIContextType, RoomUIState } from './types';

const toggleSidebar = (current: RoomSidebar | null, requested: RoomSidebars, tab?: SidebarTab): RoomSidebar | null => {
  if (current?.type === requested) return null;

  return {
    type: RoomSidebars.USERS,
    tab: tab ?? SidebarTab.WAITING_LIST,
  };
};

export const roomUIActions = {
  setValues: (values: Partial<RoomUIState>) => createAction('setValues', values),
  toggleHeaderAndFooter: () => createAction('toggleHeaderAndFooter'),
  toggleSpotlightSidebar: () => createAction('toggleSpotlightSidebar'),
  toggleIsScreenTilesVisible: () => createAction('toggleIsScreenTilesVisible'),
  closeSidebar: () => createAction('closeSidebar'),
  toggleUsersSidebar: (tab?: SidebarTab) => createAction('toggleUsersSidebar', tab),
  togglePip: () => createAction('togglePip'),
};

const roomUIReducer = (state: RoomUIState, action: GetActionTypes<typeof roomUIActions>): RoomUIState => {
  switch (action.type) {
    case 'setValues':
      return { ...state, ...action.payload };
    case 'toggleHeaderAndFooter':
      return {
        ...state,
        isHeaderAndFooterShown: !state.isHeaderAndFooterShown,
      };
    case 'toggleIsScreenTilesVisible':
      return { ...state, isScreenTilesVisible: !state.isScreenTilesVisible };
    case 'toggleSpotlightSidebar':
      return {
        ...state,
        isSpotlightSidebarVisible: !state.isSpotlightSidebarVisible,
      };
    case 'toggleUsersSidebar':
      return {
        ...state,
        shouldAnimateSidebar: state.activeSidebar?.type === RoomSidebars.USERS,
        activeSidebar: toggleSidebar(state.activeSidebar, RoomSidebars.USERS, action.payload),
      };
    case 'togglePip':
      return {
        ...state,
        isLocalViewFloating: !state.isLocalViewFloating,
        isSpotlightSidebarVisible: true,
      };
    case 'closeSidebar':
      return { ...state, shouldAnimateSidebar: true, activeSidebar: null };
    default: {
      throw new Error(`Unsupported RoomUIAction type: ${action}`);
    }
  }
};

export const RoomUIContext = createContext<RoomUIContextType | null>(null);

const RoomUIProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(roomUIReducer, {
    isExternalFullScreen: false,
    isHeaderAndFooterShown: !getIsMobile(),
    isHeaderVisible: true,
    isFooterVisible: true,
    isSpotlightSidebarVisible: true,
    isHeaderRevealDisabled: false,
    isScreenTilesVisible: true,
    activeSidebar: null,
    shouldAnimateSidebar: true,
    isLocalViewFloatingEnabled: true,
    isLocalViewFloating: getIsMobile(),
  });

  const isLocalViewFloating = state.isLocalViewFloating && state.isLocalViewFloatingEnabled;

  return (
    <RoomUIContext.Provider
      value={{
        state: { ...state, isLocalViewFloating },
        actions: roomUIActions,
        dispatch,
      }}
    >
      {children}
    </RoomUIContext.Provider>
  );
};

export default RoomUIProvider;
