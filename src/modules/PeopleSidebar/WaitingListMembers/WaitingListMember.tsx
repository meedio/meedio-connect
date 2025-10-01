import { useTranslation } from 'react-i18next';

import Member from 'components/Member';
import RoomSidebar from 'components/RoomSidebar/RoomSidebar';

import useParticipantActions from '../useParticipantActions';

interface WaitingListMemberProps {
  userId: string;
  name: string;
}

const WaitingListMember: React.FC<WaitingListMemberProps> = ({ userId, name }) => {
  const { t } = useTranslation();
  const { isAcceptLoading, accept, openRejectModal } = useParticipantActions({ matrixUserId: userId, name });

  return (
    <Member name={name}>
      <div className="space-x-1 flex">
        <RoomSidebar.Button onClick={accept} isDisabled={isAcceptLoading} isLoading={isAcceptLoading}>
          {t('accept')}
        </RoomSidebar.Button>
        <RoomSidebar.Button variant="destructive" onClick={openRejectModal} isDisabled={isAcceptLoading}>
          {t('deny')}
        </RoomSidebar.Button>
      </div>
    </Member>
  );
};

export default WaitingListMember;
