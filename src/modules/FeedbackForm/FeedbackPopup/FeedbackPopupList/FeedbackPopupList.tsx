import Spinner from 'components/Spinner/Spinner';
import { useFeedbackContext } from 'contexts/FeedbackContext/FeedbackContext';
import useUpdateFeedback from 'hooks/useUpdateFeedback/useUpdateFeedback';

import { FeedbackIssueName, getFeedbackTranslations } from '../../utils';

interface FeedbackPopupListProps {
  onClick: (issueId: number) => void;
}

const FeedbackPopupList = ({ onClick }: FeedbackPopupListProps) => {
  const { issueList } = useFeedbackContext();
  const { updateFeedbackAndFinish, updateFeedback } = useUpdateFeedback();

  const feedbackTranslations = getFeedbackTranslations();

  return (
    <>
      {!issueList ? (
        <Spinner className="h-20 w-20 m-auto" variant="black" />
      ) : (
        issueList.map(({ id, name }) => {
          const handleSend = () => {
            const isOtherIssue = name === FeedbackIssueName.OTHER;
            const update = isOtherIssue ? updateFeedback : updateFeedbackAndFinish;

            update({ issueId: id });

            if (isOtherIssue) onClick(id);
          };

          return (
            <button className="text-start text-size-sm hover:text-primary-50 font-medium" key={id} onClick={handleSend}>
              {feedbackTranslations[name]}
            </button>
          );
        })
      )}
    </>
  );
};

export default FeedbackPopupList;
