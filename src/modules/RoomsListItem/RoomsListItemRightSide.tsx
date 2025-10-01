import Button from '@shared/components/Button/Button';
import { Room } from 'matrix-js-sdk/src';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Video } from 'assets/icons/Video.svg';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';

import RoomActiveIndicator from './RoomActiveIndicator';
import RoomOptionsDropdown from './RoomOptionsDropdown';
import { getCallSessionDetails, getRoomPathIdentifier } from './utils';

interface RoomsListItemRightSideProps {
  room: Room;
  description: string | null;
}

const RoomsListItemRightSide = ({
  room,
  description,
}: RoomsListItemRightSideProps) => {
  const { matrixClient } = useMatrixContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onJoinClick = () => navigate(`/rooms/${getRoomPathIdentifier(room)}`);
  const { isActive, participantsCount } = getCallSessionDetails(
    matrixClient,
    room
  );
  const hasActiveSession = isActive && !!participantsCount;

  return (
    <>
      <div className='w-full flex justify-end gap-2'>
        <Button
          variant='secondaryTertiary'
          size='sm'
          className='!bg-transparent w-fit hidden sm:flex'
          onClick={onJoinClick}
        >
          {t('join')}
        </Button>
        <Button
          variant='primary'
          size='icon'
          className='p-[7px] sm:hidden flex'
          onClick={onJoinClick}
        >
          <Video className='w-6 h-6 stroke-white stroke-1.5' />
        </Button>
        {hasActiveSession && (
          <RoomActiveIndicator participantsCount={participantsCount} />
        )}
      </div>
      <span className='ml-2'>
        <RoomOptionsDropdown room={room} roomMetadata={{ description }} />
      </span>
    </>
  );
};

export default RoomsListItemRightSide;
