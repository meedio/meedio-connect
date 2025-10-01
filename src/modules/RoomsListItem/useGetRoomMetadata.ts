import { EventType, MatrixEvent, Room, RoomEvent } from 'matrix-js-sdk/src';
import { useEffect, useState } from 'react';

import { isValidRoomTopicStateEvent } from 'utils/matrixUtils';

import { getRoomMetadata } from './utils';

const useGetRoomMetadata = (room: Room) => {
  const metadata = getRoomMetadata(room);
  const [description, setDescription] = useState(metadata.description);

  useEffect(() => {
    const handleTimelineEvent = ({ event: { type, content } }: MatrixEvent) => {
      const isDescriptionEvent =
        type === EventType.RoomTopic && isValidRoomTopicStateEvent(content);

      if (isDescriptionEvent) setDescription(content.topic);
    };

    room.on(RoomEvent.Timeline, handleTimelineEvent);

    return () => {
      room.off(RoomEvent.Timeline, handleTimelineEvent);
    };
  }, [room]);

  return { description };
};

export default useGetRoomMetadata;
