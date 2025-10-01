import { useTranslation } from 'react-i18next';

import { ReactComponent as UserPlus } from 'assets/icons/UserPlus.svg';
import CopyButton from 'components/CopyButton/CopyButton';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';

import SidebarPlaceholder from './SidebarPlaceholder';
import WaitingInformationBlock from './WaitingInformationBlock';

interface WaitingPlaceholderProps {
  isInSidebar?: boolean;
}

const WaitingPlaceholder = ({ isInSidebar = false }: WaitingPlaceholderProps) => {
  const { t } = useTranslation();
  const {
    state: { startDate },
  } = useRoomIdentityContext();

  if (isInSidebar) return <SidebarPlaceholder />;

  const [title, subtitle] = startDate
    ? [t('waiting_for_other_participants'), t('waiting_for_other_participants_desc')]
    : [t('appointment_title'), t('share_link')];

  return (
    <div className="flex h-full w-full overflow-y-auto p-4 select-none">
      <div className="max-w-120 m-auto w-full">
        <WaitingInformationBlock className="relative !px-0" icon={UserPlus} title={title} subtitle={subtitle} />
        {!startDate && (
          <div className="mt-6">
            <CopyButton link={window.location.href} isWhite />
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingPlaceholder;
