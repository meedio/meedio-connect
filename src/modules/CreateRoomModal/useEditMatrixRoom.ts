import { useModal } from '@ebay/nice-modal-react';
import { EventType, Room } from 'matrix-js-sdk/src';
import { useState } from 'react';
import { FieldNamesMarkedBoolean } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';
import useToggleWaitingList from 'hooks/useToggleWaitingList/useToggleWaitingList';
import { formatUrl } from 'modules/Matrix/utils';

import CreateRoomModal from './CreateRoomModal';
import { extractAliasAsPath } from './utils';

type EditableRoomProps = {
  roomTitle: string;
  roomAlias?: string;
  isWaitingListEnabled: boolean;
  description?: string;
};

type EditRoomProps = EditableRoomProps & {
  room: Room;
};

type UseEditMatrixRoomProps = {
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<EditableRoomProps>>>;
};

const useEditMatrixRoom = ({ dirtyFields }: UseEditMatrixRoomProps) => {
  const { t } = useTranslation();
  const { matrixClient, matrixUrl } = useMatrixContext();
  const { pushToast } = useToast();
  const { remove } = useModal(CreateRoomModal);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const { toggleWaitingList } = useToggleWaitingList();

  const editRoom = async ({ roomAlias, roomTitle, room, description, isWaitingListEnabled }: EditRoomProps) => {
    setIsEditLoading(true);
    try {
      const fullAlias = `#${roomAlias}:${formatUrl(matrixUrl, true)}`;
      const oldRoomAlias = room.getCanonicalAlias();

      if (dirtyFields.roomTitle) {
        await matrixClient.sendStateEvent(room.roomId, EventType.RoomName, { name: roomTitle });
      }

      if (dirtyFields.description) {
        await matrixClient.sendStateEvent(room.roomId, EventType.RoomTopic, { topic: description || '' });
      }

      if (dirtyFields.isWaitingListEnabled) {
        await toggleWaitingList({ isWaitingListEnabled: !isWaitingListEnabled, roomId: room.roomId });
      }

      const initialAlias = extractAliasAsPath(oldRoomAlias || '');
      if (roomAlias && roomAlias !== initialAlias) {
        await matrixClient.createAlias(fullAlias, room.roomId);
        await matrixClient.sendStateEvent(room.roomId, EventType.RoomCanonicalAlias, { alias: fullAlias });
      }
      remove();
    } catch (error) {
      pushToast({ variant: 'error', title: t('room_creation_error') });
    } finally {
      setIsEditLoading(false);
    }
  };

  return { editRoom, isEditLoading };
};

export default useEditMatrixRoom;
