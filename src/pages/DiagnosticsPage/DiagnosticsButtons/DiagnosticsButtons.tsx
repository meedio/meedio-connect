import Button from '@shared/components/Button/Button';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Heartbeat } from 'assets/icons/Heartbeat.svg';
import Spinner from 'components/Spinner/Spinner';

import DiagnosticsGoBackButton from './DiagnosticsGoBackButton';

interface DiagnosticsButtonsProps {
  onStartClick: () => void;
  className?: string;
  isRunning?: boolean;
  hasRestartButton?: boolean;
}

const DiagnosticsButtons = ({
  onStartClick,
  className,
  isRunning = false,
  hasRestartButton = false,
}: DiagnosticsButtonsProps) => {
  const { t } = useTranslation();

  const displayStartButtonText = () => {
    if (isRunning) return t('diagnostics_running');
    if (hasRestartButton) return t('restart_diagnostics');

    return t('start_diagnostics');
  };

  return (
    <div className={cx('flex flex-col-reverse md:flex-row space-y-reverse space-y-2 md:space-y-0', className)}>
      <DiagnosticsGoBackButton />
      <Button onClick={onStartClick} variant="primary" className="md:w-fit-content w-full" disabled={isRunning}>
        {displayStartButtonText()}
        {isRunning ? (
          <Spinner variant="gray50" size="xxs" className="ml-3" />
        ) : (
          <Heartbeat className="color-white ml-3 h-6 w-6 stroke-current stroke-1.5" />
        )}
      </Button>
    </div>
  );
};

export default DiagnosticsButtons;
