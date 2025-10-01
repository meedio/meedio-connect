import Tab from '@shared/components/Tab/Tab';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RoomSidebars } from 'contexts/RoomUIContext/types';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { useWaitingListContext } from 'contexts/WaitingListContext/useWaitingListContext';

import ActiveParticipants from './ActiveParticipants/ActiveParticipants';
import { SidebarTab } from './utils';
import WaitingListMembers from './WaitingListMembers/WaitingListMembers';

const SidebarParticipantsList = () => {
  const { t } = useTranslation();
  const { isWaitingListEnabled } = useWaitingListContext();
  const {
    state: { activeSidebar },
  } = useRoomUIContext();
  const initialSidebarTab = activeSidebar?.type === RoomSidebars.USERS ? activeSidebar.tab : SidebarTab.WAITING_LIST;
  const [selectedTab, setSelectedTab] = useState(!isWaitingListEnabled ? SidebarTab.PARTICIPANTS : initialSidebarTab);

  useEffect(() => {
    if (!isWaitingListEnabled && selectedTab === SidebarTab.WAITING_LIST) setSelectedTab(SidebarTab.PARTICIPANTS);
  }, [isWaitingListEnabled, selectedTab]);

  return (
    <div className="flex h-full w-full overflow-hidden flex-col overflow-y-auto space-y-4">
      <div className="mb-4 flex h-fit flex-row space-x-8">
        {isWaitingListEnabled && (
          <Tab
            isActive={selectedTab === SidebarTab.WAITING_LIST}
            onClick={() => setSelectedTab(SidebarTab.WAITING_LIST)}
            key={SidebarTab.WAITING_LIST}
            className="capitalize"
          >
            {t('waiting_list_tab')}
          </Tab>
        )}
        <Tab
          isActive={selectedTab === SidebarTab.PARTICIPANTS}
          onClick={() => setSelectedTab(SidebarTab.PARTICIPANTS)}
          key={SidebarTab.PARTICIPANTS}
          className="capitalize"
        >
          {t('participants')}
        </Tab>
      </div>
      {selectedTab === SidebarTab.WAITING_LIST ? <WaitingListMembers /> : <ActiveParticipants />}
    </div>
  );
};

export default SidebarParticipantsList;
