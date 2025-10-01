import { EventType } from 'matrix-js-sdk/src';
import { FieldNamesMarkedBoolean } from 'react-hook-form';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToggleWaitingList from 'hooks/useToggleWaitingList/useToggleWaitingList';
import { formatUrl } from 'modules/Matrix/utils';
import logger from 'utils/logging/faro';

import { CreateRoomProps, UpdateRoomProps } from './utils';
import { extractAliasAsPath } from '../CreateNewRoomDataProvider/utils';

const useEditMatrixRoom = (dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<CreateRoomProps>>>) => {
  const { matrixClient, matrixUrl } = useMatrixContext();
  const { toggleWaitingList } = useToggleWaitingList();

  const editRoom = async ({ roomAlias, roomName, room, isWaitingListEnabled, description }: UpdateRoomProps) => {
    try {
      const fullAlias = `#${roomAlias}:${formatUrl(matrixUrl, true)}`;
      const { roomId } = room;
      const oldRoomAlias = room.getCanonicalAlias();

      if (dirtyFields.roomName) {
        await matrixClient.sendStateEvent(roomId, EventType.RoomName, { name: roomName });
      }

      if (dirtyFields.description) {
        await matrixClient.sendStateEvent(room.roomId, EventType.RoomTopic, { topic: description || '' });
      }

      if (dirtyFields.isWaitingListEnabled) {
        await toggleWaitingList({ isWaitingListEnabled: !isWaitingListEnabled, roomId });
      }

      const initialAlias = extractAliasAsPath(oldRoomAlias || '');
      if (roomAlias && roomAlias !== initialAlias) {
        await matrixClient.createAlias(fullAlias, roomId);
        await matrixClient.sendStateEvent(roomId, EventType.RoomCanonicalAlias, { alias: fullAlias });
      }
    } catch (error) {
      logger.error('Error editing room:', error);
      throw error;
    }
  };

  return editRoom;
};

export default useEditMatrixRoom;
