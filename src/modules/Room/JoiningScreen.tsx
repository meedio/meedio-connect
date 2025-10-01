import { useTranslation } from 'react-i18next';

import MeetingDiagnosticsButton from 'components/MeetingDiagnosticsButton/MeetingDiagnosticsButton';
import Spinner from 'components/Spinner/Spinner';
import useTheme from 'hooks/useTheme';

const JoiningScreen = () => {
  const { t } = useTranslation();
  const { spinnerVariant } = useTheme();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex w-full justify-end p-4">
        <MeetingDiagnosticsButton />
      </div>
      <div className="m-auto space-x-4 flex justify-center items-center">
        <span className="dark:text-white text-gray-80">{t('joining_meeting')}...</span>
        <Spinner variant={spinnerVariant} size="xs" />
      </div>
    </div>
  );
};

export default JoiningScreen;
