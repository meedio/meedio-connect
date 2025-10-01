import { useRoomContext } from '@livekit/components-react';
import { useTranslation } from 'react-i18next';

import Member from 'components/Member';
import RoomSidebar from 'components/RoomSidebar/RoomSidebar';
import testingConstants from 'utils/testingConstants';

import useParticipantActions from '../useParticipantActions';

interface ActiveParticipantProps {
  identity: string;
  matrixUserId: string;
  openedModalParticipantIdentityRef: React.MutableRefObject<string | null>;
  resetRef: () => void;
  name?: string;
}

const ActiveParticipant = ({
  identity,
  matrixUserId,
  openedModalParticipantIdentityRef,
  resetRef,
  name,
}: ActiveParticipantProps) => {
  const { t } = useTranslation();
  const room = useRoomContext();
  const { openKickModal, openBanModal } = useParticipantActions({
    identity,
    matrixUserId,
    openedModalParticipantIdentityRef,
    resetRef,
    name,
  });

  const isLocalParticipant = identity === room.localParticipant.identity;

  return (
    <Member name={name} key={identity} isLocalMember={isLocalParticipant}>
      {!isLocalParticipant && (
        <div className="space-x-1 flex">
          <RoomSidebar.Button onClick={openKickModal} data-testid={`${testingConstants.kickButton}-${name}`}>
            {t('kick')}
          </RoomSidebar.Button>
          <RoomSidebar.Button variant="destructive" onClick={openBanModal}>
            {t('ban')}
          </RoomSidebar.Button>
        </div>
      )}
    </Member>
  );
};

export default ActiveParticipant;
