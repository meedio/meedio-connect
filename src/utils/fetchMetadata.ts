import { MatrixClient } from 'matrix-js-sdk/src';

import logger from 'utils/logger';
import { commonStateKeys, isValidRoomTopicStateEvent } from 'utils/matrixUtils';

type FetchRoomMetadataResult = {
  description: string | null;
};

const fetchRoomMetadata = async (
  matrixClient: MatrixClient,
  roomId: string
): Promise<FetchRoomMetadataResult> => {
  let description: string | null = null;

  const fetchRoomDescription = matrixClient
    .getStateEvent(roomId, 'm.room.topic', commonStateKeys.default)
    .then((roomTopicEvent) => {
      if (isValidRoomTopicStateEvent(roomTopicEvent)) {
        description = roomTopicEvent.topic || '';
      }
    })
    .catch((error) => logger.error('Failed to fetch room description:', error));

  await fetchRoomDescription;

  return { description };
};

export default fetchRoomMetadata;
