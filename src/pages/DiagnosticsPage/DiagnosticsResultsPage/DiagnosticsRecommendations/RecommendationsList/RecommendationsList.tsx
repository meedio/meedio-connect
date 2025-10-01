import Divider from '@shared/components/Divider/Divider';
import { Fragment } from 'react';

import useDiagnosticsStateContext from 'contexts/DiagnosticsStateProvider/useDiagnosticsStateContext';
import { logAndSendToSentry } from 'utils/utils';

import RecommendationsItem from './RecommendationsItem';
import getDiagnosticRecommendations from '../getDiagnosticRecommendations';

const RecommendationsList = () => {
  const { issueResults } = useDiagnosticsStateContext();

  const diagnosticRecommendations = getDiagnosticRecommendations();

  return (
    <div className="space-y-4 text-size-sm">
      {issueResults.map((issue, index) => {
        const recommendation = diagnosticRecommendations.find(({ id }) => id === issue);
        if (!recommendation) {
          logAndSendToSentry(`Diagnostic recommendation was not found: ${issue}`);
          return;
        }

        const { id, icon, title, description } = recommendation;
        const isLastItem = diagnosticRecommendations.length - 1 === index;

        return (
          <Fragment key={id}>
            <RecommendationsItem icon={icon} title={title} description={description} />
            {!isLastItem && <Divider className="mt-4" />}
          </Fragment>
        );
      })}
    </div>
  );
};

export default RecommendationsList;
