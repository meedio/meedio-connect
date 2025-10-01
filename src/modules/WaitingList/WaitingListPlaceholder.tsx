import { useTranslation } from 'react-i18next';

import Spinner from 'components/Spinner/Spinner';
import RoomInfoBlock from 'modules/RoomInfoBlock/RoomInfoBlock';

interface WaitingListPlaceholderProps {
  isJoining: boolean;
}

const WaitingListPlaceholder = ({ isJoining }: WaitingListPlaceholderProps) => {
  const { t } = useTranslation();

  if (isJoining) {
    return (
      <div className="flex flex-col gap-2 items-center p-4 rounded-2xl bg-white10">
        <Spinner size="xs" />
        <span>{t('you_have_been_accepted')}</span>
        <span className="text-size-sm">{t('joining_meeting')}</span>
      </div>
    );
  }

  return <RoomInfoBlock title={t('waiting_for_admission')} subtitle={t('current_waiting_list')} />;
};

export default WaitingListPlaceholder;
