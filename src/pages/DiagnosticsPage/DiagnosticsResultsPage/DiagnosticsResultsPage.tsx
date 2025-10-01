import Divider from '@shared/components/Divider/Divider';
import { useTranslation } from 'react-i18next';

import useDiagnosticsStateContext from 'contexts/DiagnosticsStateProvider/useDiagnosticsStateContext';

import StreamDiagnostics from './StreamDiagnostics/StreamDiagnostics';
import DiagnosticsButtons from '../DiagnosticsButtons/DiagnosticsButtons';

const DiagnosticsResultsPage = () => {
  const { t } = useTranslation();
  const { isDiagnosticsRunning, restartDiagnostics } = useDiagnosticsStateContext();

  return (
    <div className="flex h-full w-full justify-center overflow-y-auto">
      <div className="flex flex-col w-full h-full md:h-fit max-w-[824px] md:p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between space-y-4 md:space-y-0 p-4">
          <h4>{t('diagnostics')}</h4>
          <DiagnosticsButtons
            onStartClick={restartDiagnostics}
            isRunning={isDiagnosticsRunning}
            className="w-full md:w-auto md:space-x-4"
            hasRestartButton
          />
        </div>
        <Divider className="md:mb-4" />
        <div className="grow md:grow-0 bg-gray-10 md:border border-gray-30 md:rounded-2xl p-4 md:space-y-6 space-y-2">
          {/* NOTE: diagnostics recommendations are unfinished at the moment */}
          {/* <DiagnosticsRecommendations /> */}
          {/* <NetworkDiagnostics />
          <DiagnosticsCategory
            icon={Heartbeat}
            title={t('meedio_infrastructure')}
            subtitle="Success state"
            variant="success"
            isCollapsible={false}
          />
          <DiagnosticsCategory
            icon={ShieldCheck}
            title={t('firewall')}
            subtitle="Warning state"
            variant="warning"
            isCollapsible={false}
          />
          <DiagnosticsCategory
            icon={Video}
            title={t('stream')}
            subtitle="Neutral/loading state"
            variant="neutral"
            isCollapsible={false}
            isLoading
          /> */}
          <StreamDiagnostics />
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsResultsPage;
