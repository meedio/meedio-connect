import { useTranslation } from 'react-i18next';

import RoomSidebar from 'components/RoomSidebar/RoomSidebar';
import { useWaitingListContext } from 'contexts/WaitingListContext/useWaitingListContext';
import useToggleRoomWaitingList from 'hooks/useToggleWaitingList/useToggleRoomWaitingList';

const WaitingListToggle = () => {
  const { t } = useTranslation();
  const { isWaitingListEnabled } = useWaitingListContext();
  const { toggleRoomWaitingList, isToggleWaitingListLoading } = useToggleRoomWaitingList();

  return (
    <RoomSidebar.Toggle
      isChecked={isWaitingListEnabled}
      onChange={toggleRoomWaitingList}
      label={t('waiting_list')}
      loading={isToggleWaitingListLoading}
    />
  );
};

export default WaitingListToggle;
