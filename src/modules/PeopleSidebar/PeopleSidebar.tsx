import Divider from '@shared/components/Divider/Divider';
import { useTranslation } from 'react-i18next';

import RoomSidebar from 'components/RoomSidebar/RoomSidebar';
import { RoomSidebars } from 'contexts/RoomUIContext/types';
import useIsRoomOwner from 'hooks/useIsRoomOwner';

import SidebarParticipantsList from './SidebarParticipantsList';
import WaitingListToggle from './WaitingListToggle';

const PeopleSidebar = () => {
  const { t } = useTranslation();
  const isOwner = useIsRoomOwner();

  if (!isOwner) return null;

  return (
    <RoomSidebar sidebar={RoomSidebars.USERS} className="space-y-4">
      <RoomSidebar.Header>{t('people')}</RoomSidebar.Header>
      <Divider />
      <WaitingListToggle />
      <Divider />
      <SidebarParticipantsList />
    </RoomSidebar>
  );
};

export default PeopleSidebar;
