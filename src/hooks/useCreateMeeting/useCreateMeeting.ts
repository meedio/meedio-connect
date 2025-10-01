import { EventType, ICreateRoomStateEvent, Preset } from 'matrix-js-sdk/src/matrix';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';
import useCreateRoom from 'hooks/useCreateRoom/useCreateRoom';
import logger from 'utils/logging/faro';

type CreateMeetingProps = {
  title: string;
  alias?: string;
  isWaitingListEnabled: boolean;
  description?: string;
  customInitialStates?: ICreateRoomStateEvent[];
  preset?: Preset;
};

const useCreateMeeting = () => {
  const { t } = useTranslation();
  const { matrixClient } = useMatrixContext();
  const [isLoading, setIsLoading] = useState(false);
  const { pushToast } = useToast();
  const { createRoom } = useCreateRoom();

  const createMeeting = async ({
    title,
    alias,
    isWaitingListEnabled,
    description,
    customInitialStates = [],
    preset,
  }: CreateMeetingProps) => {
    setIsLoading(true);
    let space;
    let chatRoom;

    const initialStates = [...customInitialStates];

    try {
      space = await createRoom({
        customCreationContent: { type: 'm.space' },
        customInitialStates: initialStates,
        title,
        alias,
        isWaitingListEnabled,
        description,
        preset,
      });
      if (!space) return;

      chatRoom = await createRoom({ title });
      if (!chatRoom) return;

      const content = { roomType: 'CHAT' } as any;
      await matrixClient.sendStateEvent(space.room_id, EventType.SpaceChild, content, chatRoom.room_id);

      return space;
    } catch (error) {
      logger.error('Cannot create matrix room', error);
      if (space) matrixClient.leave(space.room_id);
      if (chatRoom) matrixClient.leave(chatRoom.room_id);

      return pushToast({ variant: 'error', title: t('room_creation_error') });
    } finally {
      setIsLoading(false);
    }
  };

  return { createMeeting, isLoading };
};

export default useCreateMeeting;
