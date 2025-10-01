import { useTranslation } from 'react-i18next';

import { ReactComponent as Users } from 'assets/icons/Users.svg';
import FooterButton from 'components/FooterButton';
import { RoomSidebars } from 'contexts/RoomUIContext/types';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { useWaitingListContext } from 'contexts/WaitingListContext/useWaitingListContext';
import testingConstants from 'utils/testingConstants';

const PeopleSidebarButton = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    actions: { toggleUsersSidebar },
    state: { activeSidebar },
  } = useRoomUIContext();
  const { waitingListMembers } = useWaitingListContext();

  const handleToggleSidebar = () => dispatch(toggleUsersSidebar());
  const isSidebarActive = activeSidebar?.type === RoomSidebars.USERS;

  return (
    <FooterButton
      onClick={handleToggleSidebar}
      variant={isSidebarActive ? 'primary' : undefined}
      tooltipLabel={t('people')}
      tooltipPlacement="top-end"
      icon={Users}
      isActive={isSidebarActive}
      aria-pressed={isSidebarActive}
      aria-label={t('people')}
      badgeValue={waitingListMembers.length}
      data-testid={testingConstants.peopleSidebarButton}
    />
  );
};

export default PeopleSidebarButton;
