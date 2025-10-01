import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ReactComponent as StatusFailed } from 'assets/icons/StatusFailed.svg';
import { ReactComponent as StatusSuccess } from 'assets/icons/StatusSuccess.svg';
import { ReactComponent as StatusWarning } from 'assets/icons/StatusWarning.svg';

import useDiagnosticsScore from './useDiagnosticsScore';
import { MAX_DIAGNOSTICS_SCORE } from './utils';

const diagnosticsScoreBadgeVariants = {
  critical: { classNames: 'bg-tertiary-10 text-error-50', icon: StatusFailed },
  warning: { classNames: 'bg-secondary-10 text-warning-50', icon: StatusWarning },
  success: { classNames: 'bg-primary-10 text-primary-70', icon: StatusSuccess },
};

type DiagnosticsScoreBadgeVariantsType = keyof typeof diagnosticsScoreBadgeVariants;

const getVariant = (score: number): DiagnosticsScoreBadgeVariantsType => {
  if (score < 4) return 'critical';
  if (score < 5) return 'warning';

  return 'success';
};

const DiagnosticsScoreBadge = () => {
  const { t } = useTranslation();
  const score = useDiagnosticsScore();

  const variant = getVariant(score);
  const Icon = diagnosticsScoreBadgeVariants[variant].icon;

  return (
    <div
      className={cx(
        'px-4 py-2 rounded-lg space-x-2 flex items-center whitespace-nowrap w-fit',
        diagnosticsScoreBadgeVariants[variant].classNames
      )}
    >
      <Icon className="stroke-current stroke-1.5 h-6 w-6" />
      <span className="font-medium">
        {t('score')}: {score}/{MAX_DIAGNOSTICS_SCORE}
      </span>
    </div>
  );
};

export default DiagnosticsScoreBadge;
