import { Room } from 'matrix-js-sdk/src';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';

import ActivityIndicatorSubtitle from './ActivityIndicatorSubtitle';
import EndedSubtitle from './EndedSubtitle';
import { getCallSessionDetails } from '../utils';

interface RoomsListItemSubtitleProps {
  room: Room;
}

const RoomsListItemSubtitle = ({ room }: RoomsListItemSubtitleProps) => {
  const { matrixClient } = useMatrixContext();

  const { isActive, participantsCount, endedAt } = getCallSessionDetails(
    matrixClient,
    room
  );

  const hasActiveSession = isActive && !!participantsCount;
  const isEnded = !isActive && !!endedAt;
  const isSubtitleVisible = hasActiveSession || isEnded;

  if (!isSubtitleVisible) return null;

  return (
    <div className='text-gray-80 flex items-center gap-1'>
      {hasActiveSession && <ActivityIndicatorSubtitle />}
      {isEnded && <EndedSubtitle endedAt={endedAt} />}
    </div>
  );
};

export default RoomsListItemSubtitle;
