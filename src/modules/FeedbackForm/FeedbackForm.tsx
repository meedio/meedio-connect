import { popupContainerWidthStyle } from '@shared/components/Popup/Popup';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import useShowDiagnosticsModal from 'components/MeetingDiagnosticsButton/useShowDiagnosticsModal';
import Spinner from 'components/Spinner/Spinner';
import { useFeedbackContext, withFeedbackContextProvider } from 'contexts/FeedbackContext/FeedbackContext';
import ModalProvider from 'contexts/ModalProvider/ModalProvider';
import useFeedback from 'hooks/useFeedback/useFeedback';

import FeedbackButton from './FeedbackButton/FeedbackButton';
import { processFeedbackIssues } from './utils';

const FeedbackForm = () => {
  const { t } = useTranslation();
  const showDiagnosticsModal = useShowDiagnosticsModal();
  const { isLoading, isFeedbackCompleted, isBadFeedbackSent, issueList, setIssueList } = useFeedbackContext();
  const { fetchIssues } = useFeedback();
  const [isIssuesLoading, setIsIssuesLoading] = useState(false);

  useEffect(() => {
    if (issueList?.length || isIssuesLoading) return;

    setIsIssuesLoading(true);
    fetchIssues()
      .then((data) => {
        if (data === null) return;
        if (!data) throw new Error('No user feedback issues in fetchIssues');

        const filteredFeedbackIssues = processFeedbackIssues(data);
        setIssueList(filteredFeedbackIssues);
      })
      .finally(() => setIsIssuesLoading(false));
  }, [fetchIssues, isIssuesLoading, issueList, setIssueList]);

  const privacy = (
    <a
      href={t('privacy_policy_link')}
      target="_blank"
      rel="noreferrer"
      className="dark:text-white text-primary-50 underline hover:text-primaryComp-50"
    >
      Privacy Policy
    </a>
  );

  // TODO: needs to be fixed after diagnostics become available
  const diagnostics = (
    <button
      onClick={showDiagnosticsModal}
      className="dark:text-white text-primary-50 underline hover:text-primaryComp-50"
    >
      Diagnostics page
    </button>
  );

  const [title, subtitleKey, element] = isFeedbackCompleted
    ? [t('feedback.acknowledgment'), 'feedback.diagnostics', diagnostics]
    : [t('feedback.title_question'), 'feedback.privacy_policy', privacy];
  const feedbackText = isLoading ? t('feedback.loading') : title;
  const isCompletedWithGoodFeedback = isFeedbackCompleted && !isBadFeedbackSent;
  const shouldDisplaySubtitle = !isLoading && !isCompletedWithGoodFeedback;

  return (
    <ModalProvider>
      <div className={cx('flex-grow w-full text-center dark:text-white text-black p-4', popupContainerWidthStyle)}>
        <p className="py-4 font-medium">{feedbackText}</p>
        {isLoading && <Spinner className="h-20 w-20 m-auto" variant="white" />}
        {!isFeedbackCompleted && !isLoading && (
          <div className="flex justify-center my-4 space-x-20">
            <FeedbackButton variant="good" />
            <FeedbackButton variant="bad" />
          </div>
        )}
        {shouldDisplaySubtitle && (
          <p className="text-size-xs font-light dark:text-gray-50 text-gray-80">
            <Trans i18nKey={subtitleKey} components={{ element }} />
          </p>
        )}
      </div>
    </ModalProvider>
  );
};

export default withFeedbackContextProvider(FeedbackForm);
