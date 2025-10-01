import Button from '@shared/components/Button/Button';
import Tooltip from '@shared/components/Tooltip/Tooltip';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Heartbeat } from 'assets/icons/Heartbeat.svg';
import useTheme from 'hooks/useTheme';

import useShowDiagnosticsModal from './useShowDiagnosticsModal';

const MeetingDiagnosticsButton = () => {
  const { t } = useTranslation();
  const { isLightTheme, tooltipVariant } = useTheme();
  const openConfirmationModal = useShowDiagnosticsModal();

  return (
    <Tooltip variant={tooltipVariant} label={t('diagnostics')} placement="bottom" hoverDesktopOnly>
      <Button
        onClick={openConfirmationModal}
        size="neutral"
        variant={isLightTheme ? 'buttonIconSecondaryTertiary' : 'buttonIconContrastTertiary'}
        className="p-2 md:p-[11px]"
        tabIndex={-1}
        aria-label={t('diagnostics')}
      >
        <Heartbeat className="stroke-1.5 h-6 w-6 stroke-current" />
      </Button>
    </Tooltip>
  );
};

export default MeetingDiagnosticsButton;
