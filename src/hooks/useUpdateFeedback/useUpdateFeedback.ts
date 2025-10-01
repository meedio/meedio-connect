import { useModal } from '@ebay/nice-modal-react';

import { useFeedbackContext } from 'contexts/FeedbackContext/FeedbackContext';
import useFeedback, { AdditionalFeedbackSubmitData } from 'hooks/useFeedback/useFeedback';
import FeedbackPopup from 'modules/FeedbackForm/FeedbackPopup/FeedbackPopup';

const useUpdateFeedback = () => {
  const { setIsLoading, setIsFeedbackCompleted } = useFeedbackContext();
  const { updateFeedback } = useFeedback();
  const { remove } = useModal(FeedbackPopup);

  const updateFeedbackAndFinish = async (data: AdditionalFeedbackSubmitData) => {
    setIsLoading(true);
    remove();
    await updateFeedback(data).finally(() => {
      setIsLoading(false);
      setIsFeedbackCompleted(true);
    });
  };

  return { updateFeedbackAndFinish, updateFeedback };
};

export default useUpdateFeedback;
