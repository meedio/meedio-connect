import { FailureLevelsEnum } from 'pages/DiagnosticsPage/utils';

import { DiagnosticIssuesEnum, DiagnosticRecommendationType } from '../getDiagnosticRecommendations';

export const MAX_DIAGNOSTICS_SCORE = 5;
const CRITICAL_WEIGHT = 1;
const WARNING_WEIGHT = 0.5;

interface CalculateScoreProps {
  encounteredCriticalCount: number;
  encounteredWarningCount: number;
  totalCriticalCount: number;
  totalWarningCount: number;
}

export const calculateScore = ({
  encounteredCriticalCount,
  encounteredWarningCount,
  totalCriticalCount,
  totalWarningCount,
}: CalculateScoreProps) => {
  const totalWeight = totalCriticalCount * CRITICAL_WEIGHT + totalWarningCount * WARNING_WEIGHT;
  const userIssuesWeight = encounteredCriticalCount * CRITICAL_WEIGHT + encounteredWarningCount * WARNING_WEIGHT;
  const userIssuesRatio = userIssuesWeight / totalWeight;

  const score = MAX_DIAGNOSTICS_SCORE - userIssuesRatio * MAX_DIAGNOSTICS_SCORE;
  const validScore = parseFloat(Math.max(0, Math.min(MAX_DIAGNOSTICS_SCORE, score)).toFixed(1));

  return validScore;
};

export const getIssuesCountByLevel = (
  issueResults: DiagnosticIssuesEnum[],
  diagnosticRecommendations: DiagnosticRecommendationType[]
) =>
  issueResults.reduce(
    (acc, result) => {
      const diagnosticRecommendation = diagnosticRecommendations.find(({ id }) => id === result);
      if (!diagnosticRecommendation) return acc;

      const { failureLevel } = diagnosticRecommendation;

      if (failureLevel === FailureLevelsEnum.WARNING) acc.warningCount++;
      else if (failureLevel === FailureLevelsEnum.CRITICAL) acc.criticalCount++;

      return acc;
    },
    { criticalCount: 0, warningCount: 0 }
  );
