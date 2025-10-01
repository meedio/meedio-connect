import { useTranslation } from 'react-i18next';
import { useToggle } from 'rooks';

import { ReactComponent as Heartbeat } from 'assets/icons/Heartbeat.svg';
import GradientIconWithShadow from 'components/GradientIconWithShadow/GradientIconWithShadow';
import useDiagnosticsStateContext from 'contexts/DiagnosticsStateProvider/useDiagnosticsStateContext';
import withDiagnosticsStateProvider from 'contexts/DiagnosticsStateProvider/withDiagnosticsStateProvider';

import DiagnosticsButtons from './DiagnosticsButtons/DiagnosticsButtons';
import DiagnosticsResultsPage from './DiagnosticsResultsPage/DiagnosticsResultsPage';
import { getDiagnosticsAudioElement } from './DiagnosticsResultsPage/StreamDiagnostics/useAudioOutputDiagnostic/utils';

const DiagnosticsPage = () => {
  const { t } = useTranslation();
  const [hasDiagnosticsStarted, toggleHasDiagnosticsStarted] = useToggle(false);
  const { audioElementRef } = useDiagnosticsStateContext();

  if (hasDiagnosticsStarted) return <DiagnosticsResultsPage />;

  const handleStartClick = () => {
    toggleHasDiagnosticsStarted();
    const audioElement = getDiagnosticsAudioElement();
    audioElementRef.current = audioElement;
  };

  return (
    <div className="m-auto flex w-full flex-col overflow-y-auto items-center p-6">
      <GradientIconWithShadow icon={Heartbeat} />
      <div className="mt-8 flex flex-col text-center items-center md:mt-14">
        <h2 className="text-black">{t('having_issues_with_meedio')}</h2>
        <p className="text-gray-80 mt-2 text-size-lg">{t('diagnostics_description')}</p>
        <DiagnosticsButtons
          onStartClick={handleStartClick}
          className="mt-10 w-full justify-center max-w-[290px] md:max-w-unset md:space-x-6"
        />
      </div>
    </div>
  );
};

export default withDiagnosticsStateProvider(DiagnosticsPage);
