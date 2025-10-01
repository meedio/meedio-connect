import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ClockCheck } from 'assets/icons/ClockCheck.svg';

interface EndedSubtitleProps {
  endedAt: number;
}

const EndedSubtitle = ({ endedAt }: EndedSubtitleProps) => {
  const { t } = useTranslation();

  const endedDate = moment(endedAt).format('YYYY/MM/DD HH:mm');

  return (
    <>
      <ClockCheck className="h-4 w-4 shrink-0 stroke-current stroke-1.5" />
      <span className="text-size-xs text-left font-light flex gap-1">
        <span className="hidden sm:inline-block">{t('ended_at')}</span>
        <span>{endedDate}</span>
      </span>
    </>
  );
};

export default EndedSubtitle;
