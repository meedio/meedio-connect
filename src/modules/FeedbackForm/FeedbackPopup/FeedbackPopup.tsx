import { create, useModal } from '@ebay/nice-modal-react';
import Popup from '@shared/components/Popup/Popup';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import FeedbackPopupForm from './FeedbackPopupForm/FeedbackPopupForm';
import FeedbackPopupList from './FeedbackPopupList/FeedbackPopupList';

const FeedbackPopup = create(() => {
  const { remove } = useModal(FeedbackPopup);
  const { t } = useTranslation();
  const [isFeedbackFormVisible, setIsFeedbackFormVisible] = useState(false);
  const [otherIssueId, setOtherIssueId] = useState<number>();

  const showFeedbackForm = (issueId: number) => {
    setIsFeedbackFormVisible(true);
    setOtherIssueId(issueId);
  };
  const goBackToFeedbackList = () => {
    setIsFeedbackFormVisible(false);
    setOtherIssueId(undefined);
  };

  return (
    <Popup
      isViewportScrollable
      backdropClassName="backdrop-blur-sm"
      closePopup={remove}
      className="!m-auto md:!m-auto !h-auto !mx-2.5 !py-0"
      isVisible
    >
      <Popup.Container className="!max-h-unset space-y-4 !max-w-100 !mb-0">
        <Popup.HeaderRegular>
          {t('feedback.what_went_wrong')}
          <Popup.CloseIcon className="relative !right-0" closePopup={remove} />
        </Popup.HeaderRegular>
        <div className="text-start h-full flex flex-col items-start space-y-4 overflow-y-auto px-4 pb-4 md:overflow-visible">
          {!isFeedbackFormVisible ? (
            <FeedbackPopupList onClick={showFeedbackForm} />
          ) : (
            <FeedbackPopupForm issueId={otherIssueId} onGoBack={goBackToFeedbackList} />
          )}
        </div>
      </Popup.Container>
    </Popup>
  );
});

export default FeedbackPopup;
