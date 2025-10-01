import useDiagnosticsStateContext from 'contexts/DiagnosticsStateProvider/useDiagnosticsStateContext';
import { FailureLevelsEnum } from 'pages/DiagnosticsPage/utils';
import { filterArrayByKeyValue } from 'utils/utils';

import { calculateScore, getIssuesCountByLevel } from './utils';
import getDiagnosticRecommendations from '../getDiagnosticRecommendations';

const useDiagnosticsScore = () => {
  const { issueResults } = useDiagnosticsStateContext();

  // NOTE: calling it inside a hook because t function will be passed to it later
  const issues = getDiagnosticRecommendations();
  const { criticalCount, warningCount } = getIssuesCountByLevel(issueResults, issues);

  const totalCriticalCount = filterArrayByKeyValue(issues, 'failureLevel', FailureLevelsEnum.CRITICAL).length;
  const totalWarningCount = filterArrayByKeyValue(issues, 'failureLevel', FailureLevelsEnum.WARNING).length;

  const score = calculateScore({
    totalCriticalCount,
    totalWarningCount,
    encounteredCriticalCount: criticalCount,
    encounteredWarningCount: warningCount,
  });

  return score;
};

export default useDiagnosticsScore;
