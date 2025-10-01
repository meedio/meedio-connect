import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { ReactComponent as HangUp } from 'assets/icons/HangUp.svg';
import RoomEndedPageContainer from 'components/RoomEndedPageContainer';
import useSafeAreaTheme from 'hooks/useSafeAreaTheme';
import RoomEndedModal from 'modules/RoomEndedModal/RoomEndedModal';

interface RoomTerminatedPageState {
  reason: string;
}

const RoomTerminatedPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  useSafeAreaTheme();

  const { reason } = (state as RoomTerminatedPageState) || { reason: t('room_has_been_terminated') };
  const popupTitle = reason || t('room_has_been_terminated');

  return (
    <RoomEndedPageContainer>
      <RoomEndedModal>
        <RoomEndedModal.InformationBlock icon={HangUp}>
          <RoomEndedModal.InformationBlock.Title>{popupTitle}</RoomEndedModal.InformationBlock.Title>
        </RoomEndedModal.InformationBlock>
      </RoomEndedModal>
    </RoomEndedPageContainer>
  );
};

export default RoomTerminatedPage;
