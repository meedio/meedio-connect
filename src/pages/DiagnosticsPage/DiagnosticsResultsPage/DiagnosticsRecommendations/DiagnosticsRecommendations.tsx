import Divider from '@shared/components/Divider/Divider';
import { useTranslation } from 'react-i18next';

import useDiagnosticsStateContext from 'contexts/DiagnosticsStateProvider/useDiagnosticsStateContext';

import DiagnosticsScoreBadge from './DiagnosticsScoreBadge/DiagnosticsScoreBadge';
import RecommendationsList from './RecommendationsList/RecommendationsList';

const DiagnosticsRecommendations = () => {
  const { t } = useTranslation();

  const { isDiagnosticsRunning, issueResults } = useDiagnosticsStateContext();

  if (isDiagnosticsRunning) return null;

  const hasIssues = !!issueResults.length;
  const description = hasIssues ? t('we_found_some_issues') : t('no_issues_found');

  return (
    <div className="w-full bg-white border border-gray-30 rounded-2xl p-4 space-y-4">
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center space-y-2 xs:space-y-0 xs:space-x-4">
        <div className="space-y-1 text-size-sm">
          <div className="font-medium text-black">{t('diagnostics_completed')}</div>
          <div className="text-gray-80 font-light">{description}</div>
        </div>
        <DiagnosticsScoreBadge />
      </div>
      {hasIssues && (
        <>
          <Divider />
          <p className="text-size-sm font-medium">
            {t('recommendations_to_fix_issues', { count: issueResults.length })}
          </p>
          <Divider />
          <RecommendationsList />
        </>
      )}
    </div>
  );
};

export default DiagnosticsRecommendations;
