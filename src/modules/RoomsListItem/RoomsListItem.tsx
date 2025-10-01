import Avatar from '@shared/components/Avatar/Avatar';
import ListItem from '@shared/components/ListItem/ListItem';
import { type Room } from 'matrix-js-sdk/src/matrix';
import { useNavigate } from 'react-router-dom';

import RoomsListItemRightSide from './RoomsListItemRightSide';
import RoomsListItemSubtitle from './RoomsListItemSubtitle/RoomsListItemSubtitle';
import useGetRoomMetadata from './useGetRoomMetadata';
import { getRoomPathIdentifier } from './utils';

interface RoomsListItemProps {
  room: Room;
}

const RoomsListItem = ({ room }: RoomsListItemProps) => {
  const navigate = useNavigate();
  const { description } = useGetRoomMetadata(room);

  const onJoinClick = () => navigate(`/rooms/${getRoomPathIdentifier(room)}`);

  return (
    <ListItem onClick={onJoinClick}>
      <div className='flex w-full items-center justify-between gap-1'>
        <ListItem.LeftSide>
          <Avatar size='md' name={room.name} />
          <div className='flex flex-col items-start gap-1 overflow-hidden'>
            <span className='text-size-sm w-full font-medium text-black truncate'>
              {room.name}
            </span>
            <RoomsListItemSubtitle room={room} />
          </div>
        </ListItem.LeftSide>
        <ListItem.RightSide className='grow'>
          <RoomsListItemRightSide room={room} description={description} />
        </ListItem.RightSide>
      </div>
    </ListItem>
  );
};

export default RoomsListItem;
