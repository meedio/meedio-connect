import Divider from '@shared/components/Divider/Divider';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Video } from 'assets/icons/Video.svg';
import { Diagnostics } from 'contexts/DiagnosticsStateProvider/DiagnosticsStateProvider';
import useDiagnosticsStateContext from 'contexts/DiagnosticsStateProvider/useDiagnosticsStateContext';
import { FailureLevelsEnum } from 'pages/DiagnosticsPage/utils';

import getStreamDiagnosticsItems from './getStreamDiagnosticsItems';
import useStreamDiagnostics from './useStreamDiagnostics';
import { getFailedTestsCount, streamDiagnosticsCount, CheckStatus } from './utils';
import DiagnosticsCategory, { DiagnosticCategoryVariantType } from '../DiagnosticCategory/DiagnosticCategory';

const StreamDiagnostics = () => {
  const { t } = useTranslation();
  const { currentDiagnostic, isDiagnosticsRunning } = useDiagnosticsStateContext();
  const { currentTest, results } = useStreamDiagnostics();

  const diagnosticItems = getStreamDiagnosticsItems(t);
  const { criticalCount, warningCount } = getFailedTestsCount(results, diagnosticItems);
  const isRunning = currentDiagnostic === Diagnostics.Stream && isDiagnosticsRunning;
  const isWaiting = !isRunning && !results.length;

  const currentInProgressLabel = diagnosticItems.find(({ id }) => id === currentTest)?.inProgressLabel;
  const criticalLabel = criticalCount ? t('critical', { count: criticalCount }) : '';
  const ampLabel = criticalCount && warningCount ? ' &' : '';
  const warningLabel = warningCount ? t('warning', { count: warningCount }) : '';
  const endedLabel =
    criticalCount || warningCount ? `${criticalLabel}${ampLabel} ${warningLabel}` : t('completed_without_issues');
  const notRunningProgressLabel = results.length ? endedLabel : `${t('waiting')}...`;
  const progressLabel = isRunning
    ? `${currentInProgressLabel} (${currentTest + 1}/${streamDiagnosticsCount})...`
    : notRunningProgressLabel;

  const completedVariant: DiagnosticCategoryVariantType =
    (criticalCount && 'error') || (warningCount && 'warning') || 'success';

  return (
    <DiagnosticsCategory
      icon={Video}
      title={t('stream')}
      subtitle={progressLabel}
      variant={isRunning || isWaiting ? 'neutral' : completedVariant}
      isLoading={isRunning || isWaiting}
      isCollapsible={!isRunning && !isWaiting}
    >
      {diagnosticItems.map(({ id, name, subtitle, failureLevel, statuses: { failed, success } }, index) => {
        const result = results.find((result) => result.id === id);
        if (!result) return null;

        const isLastItem = diagnosticItems.length - 1 === index;
        const hasFailed = [CheckStatus.FAILED, CheckStatus.SKIPPED].includes(result.status);
        const [statusLabel, icon] = hasFailed ? [failed.statusLabel, failed.icon] : [success.statusLabel, success.icon];
        const label = CheckStatus.SKIPPED === result.status ? t('skipped') : statusLabel;
        const variant: DiagnosticCategoryVariantType =
          (hasFailed && failureLevel === FailureLevelsEnum.CRITICAL && 'error') ||
          (hasFailed && failureLevel === FailureLevelsEnum.WARNING && 'warning') ||
          'success';

        return (
          <Fragment key={name}>
            <DiagnosticsCategory.Item title={name} subtitle={subtitle} status={label} variant={variant} icon={icon} />
            {!isLastItem && <Divider />}
          </Fragment>
        );
      })}
    </DiagnosticsCategory>
  );
};

export default StreamDiagnostics;
