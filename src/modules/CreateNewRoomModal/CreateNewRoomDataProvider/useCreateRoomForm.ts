import { yupResolver } from '@hookform/resolvers/yup';
import { JoinRule, Room } from 'matrix-js-sdk/src';
import { useForm } from 'react-hook-form';

import { getRoomMetadata } from 'modules/RoomsListItem/utils';
import { Schemas } from 'utils/yup/schemas/validationSchemas';

import { getAndExtractAlias, RoomFormType } from './utils';

interface UseCreateNewRoomFormProps {
  room?: Room;
}

const useCreateNewRoomForm = ({ room }: UseCreateNewRoomFormProps) => {
  const initialAlias = getAndExtractAlias(room);
  const metadata = room && getRoomMetadata(room);

  const roomForm = useForm<RoomFormType>({
    mode: 'all',
    resolver: yupResolver(Schemas.getCreateNewRoom()),
    defaultValues: {
      roomName: room?.name || '',
      roomAlias: initialAlias || '',
      isWaitingListEnabled: room?.getJoinRule() === JoinRule.Knock,
      description: metadata?.description || '',
    },
  });

  return roomForm;
};

export default useCreateNewRoomForm;
