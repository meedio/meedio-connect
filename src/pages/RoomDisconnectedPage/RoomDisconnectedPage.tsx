import { useTranslation } from 'react-i18next';

import { ReactComponent as WifiOff } from 'assets/icons/WifiOff.svg';
import RoomEndedPageContainer from 'components/RoomEndedPageContainer';
import useSafeAreaTheme from 'hooks/useSafeAreaTheme';
import RoomEndedModal from 'modules/RoomEndedModal/RoomEndedModal';

const RoomDisconnectedPage = () => {
  const { t } = useTranslation();
  useSafeAreaTheme();

  return (
    <RoomEndedPageContainer>
      <RoomEndedModal>
        <RoomEndedModal.InformationBlock icon={WifiOff}>
          <RoomEndedModal.InformationBlock.Title>
            {t('disconnected_from_the_room')}
          </RoomEndedModal.InformationBlock.Title>
          <RoomEndedModal.InformationBlock.Description>
            {t('disconnected_from_the_room_description')}
          </RoomEndedModal.InformationBlock.Description>
        </RoomEndedModal.InformationBlock>
        <RoomEndedModal.ButtonsBlock>
          <RoomEndedModal.ButtonsBlock.JoinAgainButton>{t('join_again')}</RoomEndedModal.ButtonsBlock.JoinAgainButton>
        </RoomEndedModal.ButtonsBlock>
      </RoomEndedModal>
    </RoomEndedPageContainer>
  );
};

export default RoomDisconnectedPage;
