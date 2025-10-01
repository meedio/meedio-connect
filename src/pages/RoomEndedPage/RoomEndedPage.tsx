import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { ReactComponent as HangUp } from 'assets/icons/HangUp.svg';
import RoomEndedPageContainer from 'components/RoomEndedPageContainer';
import useIsFeatureEnabled from 'hooks/useIsFeatureEnabled';
import useSafeAreaTheme from 'hooks/useSafeAreaTheme';
import FeedbackForm from 'modules/FeedbackForm/FeedbackForm';
import RoomEndedModal from 'modules/RoomEndedModal/RoomEndedModal';
import { FeatureFlag } from 'utils/Constants';
import withMountLog from 'utils/logging/withMountLog';

export interface RoomEndedPageState {
  reason: string;
  matrixRoomId?: string;
}

const RoomEndedPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const isFeedbackFormEnabled = useIsFeatureEnabled(FeatureFlag.FEEDBACK_FORM);
  useSafeAreaTheme();

  const { reason } = (state as RoomEndedPageState) || { reason: null };
  const popupTitle = reason || t('left_the_room');

  return (
    <RoomEndedPageContainer>
      <RoomEndedModal>
        <RoomEndedModal.InformationBlock icon={HangUp}>
          <RoomEndedModal.InformationBlock.Title>{popupTitle}</RoomEndedModal.InformationBlock.Title>
          {!reason && (
            <RoomEndedModal.InformationBlock.Description>
              {t('you_can_join_back')}
            </RoomEndedModal.InformationBlock.Description>
          )}
        </RoomEndedModal.InformationBlock>
        <RoomEndedModal.ButtonsBlock>
          <RoomEndedModal.ButtonsBlock.JoinAgainButton>
            {reason ? t('close') : t('join_again')}
          </RoomEndedModal.ButtonsBlock.JoinAgainButton>
          <RoomEndedModal.ButtonsBlock.BackToMainPageButton />
        </RoomEndedModal.ButtonsBlock>
      </RoomEndedModal>
      {isFeedbackFormEnabled && <FeedbackForm />}
    </RoomEndedPageContainer>
  );
};

export default withMountLog(RoomEndedPage, 'Room ended page loaded');
