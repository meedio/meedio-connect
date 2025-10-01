import { useModal } from '@ebay/nice-modal-react';
import ControlButton from '@shared/components/ControlButton/ControlButton';
import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Thumb } from 'assets/icons/Thumb.svg';
import Spinner from 'components/Spinner/Spinner';
import { useFeedbackContext } from 'contexts/FeedbackContext/FeedbackContext';
import useFeedback from 'hooks/useFeedback/useFeedback';

import FeedbackPopup from '../FeedbackPopup/FeedbackPopup';

type FeedbackButtonVariant = 'good' | 'bad';
interface FeedbackButtonProps {
  variant: FeedbackButtonVariant;
}

const FeedbackButton = ({ variant }: FeedbackButtonProps) => {
  const { t } = useTranslation();
  const { show } = useModal(FeedbackPopup);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsFeedbackCompleted, isBadFeedbackSent, setIsBadFeedbackSent } = useFeedbackContext();
  const { sendFeedback, updateFeedback } = useFeedback();

  const onClickGood = () => {
    const sendFeedbackAction = isBadFeedbackSent ? updateFeedback : sendFeedback;
    return sendFeedbackAction({ isSatisfied: true }).finally(() => {
      setIsFeedbackCompleted(true);
      setIsBadFeedbackSent(false);
    });
  };

  const onClickBad = async () => {
    if (!isBadFeedbackSent) {
      await sendFeedback({ isSatisfied: false });
      setIsBadFeedbackSent(true);
    }

    show();
  };

  const [onClick, text, iconStyle] =
    variant === 'good' ? [onClickGood, t('feedback.good')] : [onClickBad, t('feedback.bad'), 'rotate-180'];

  const handleClick = () => {
    setIsLoading(true);
    onClick().finally(() => setIsLoading(false));
  };

  return (
    <div>
      <ControlButton
        className="p-3 !rounded-2xl bg-gray-60 dark:bg-white10 mb-2.5 hover:!bg-gray-50 dark:hover:!bg-white20"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? <Spinner size="xs" /> : <Thumb role="img" className={cx('stroke-1.5 stroke-white', iconStyle)} />}
      </ControlButton>
      <p>{text}</p>
    </div>
  );
};

export default FeedbackButton;
