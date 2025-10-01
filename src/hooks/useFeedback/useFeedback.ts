import { FeedbackIssue, useFeedbackContext } from 'contexts/FeedbackContext/FeedbackContext';
import useFeedbackData from 'hooks/useFeedbackData/useFeedbackData';
import { logAndSendToSentry } from 'utils/utils';

import useCancelableFetch from '../useCancelableFetch/useCancelableFetch';

export type AdditionalFeedbackSubmitData = {
  issueId?: number;
  comment?: string;
};

type InitialFeedbackSubmitData = { isSatisfied?: boolean };

const feedbackToken = import.meta.env.REACT_APP_FEEDBACK_TOKEN;
const feedbackUrl = import.meta.env.REACT_APP_FEEDBACK_URL;
const feedbackSubmitUrl = `${feedbackUrl}/submit/report`;
const feedbackIssuesUrl = `${feedbackUrl}/issues`;
const headers = { 'Content-Type': 'application/json', 'X-Feedback-Submit-Token': `${feedbackToken}` };

const useFeedback = () => {
  const metadata = useFeedbackData();
  const { participantIdentifier } = useFeedbackContext();

  const handleFetchIssuesError = (err: Error | unknown) =>
    logAndSendToSentry(`Failed to fetch user feedback issues list ${err}`);

  const fetchIssues = useCancelableFetch<FeedbackIssue[]>({
    input: feedbackIssuesUrl,
    init: { method: 'GET', headers },
    onError: handleFetchIssuesError,
  });

  const sendFeedback = ({ isSatisfied }: InitialFeedbackSubmitData) =>
    fetch(feedbackSubmitUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        satisfied: isSatisfied,
        uuid: participantIdentifier,
        metadata,
      }),
    }).catch((err) => logAndSendToSentry(err));

  const updateFeedback = async ({
    comment,
    issueId,
    isSatisfied,
  }: AdditionalFeedbackSubmitData & InitialFeedbackSubmitData) =>
    fetch(feedbackSubmitUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        satisfied: !!isSatisfied,
        uuid: participantIdentifier,
        comment,
        issue_id: issueId,
        metadata,
      }),
    }).catch((err) => logAndSendToSentry(err));

  return { fetchIssues, sendFeedback, updateFeedback };
};

export default useFeedback;
