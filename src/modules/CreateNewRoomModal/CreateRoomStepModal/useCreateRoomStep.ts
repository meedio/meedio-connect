import { useModal } from '@ebay/nice-modal-react';
import { Preset } from 'matrix-js-sdk/src';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { sendRoomToIdentityServer } from 'api/identityService/sendRoomToIdentityServer';
import { updateRoomInIdentityServer } from 'api/identityService/updateRoomInIdentityServer';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';
import useCreateMeeting from 'hooks/useCreateMeeting/useCreateMeeting';
import { CUSTOM_MEEDIO_EVENTS } from 'utils/matrixUtils';

import useEditMatrixRoom from './useEditMatrixRoom';
import {
  CreateRoomProps,
  generateSecret,
  getRoomSecret,
  UpdateRoomProps,
} from './utils';
import useCreateNewRoomDataContext from '../CreateNewRoomDataProvider/useCreateNewRoomDataContext';
import {
  getRandomFourDigitString,
  RoomFormType,
} from '../CreateNewRoomDataProvider/utils';

const useCreateRoomStep = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { remove } = useModal();
  const { pushToast } = useToast();
  const { matrixClient } = useMatrixContext();
  const { createMeeting } = useCreateMeeting();
  const {
    roomToEdit,
    digitsPostfix,
    setDigitsPostfix,
    roomForm: {
      trigger,
      handleSubmit,
      formState: { dirtyFields },
    },
  } = useCreateNewRoomDataContext();
  const editRoom = useEditMatrixRoom(dirtyFields);
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = async ({
    roomName,
    roomAlias,
    isWaitingListEnabled,
    description,
  }: CreateRoomProps) => {
    setIsLoading(true);

    const newRoom = await createMeeting({
      alias: roomAlias,
      isWaitingListEnabled,
      description,
      title: roomName,
      preset: Preset.PublicChat,
    });

    if (!newRoom) return setIsLoading(false);

    const roomSecret = generateSecret();
    await matrixClient.setRoomAccountData(
      newRoom.room_id,
      CUSTOM_MEEDIO_EVENTS.ROOM_SECRET,
      {
        roomSecret,
      }
    );

    const payload = {
      room_name: roomName,
      room_id: newRoom.room_id,
      room_alias: roomAlias,
      room_secret: roomSecret,
      waiting_list: isWaitingListEnabled,
    };

    try {
      await sendRoomToIdentityServer(payload);
      remove();
      navigate(`/rooms/${roomAlias}`);
    } catch (error) {
      await matrixClient.leave(newRoom.room_id);
      // NOTE: need to generate a new alias as the old one is already taken
      setDigitsPostfix(getRandomFourDigitString());
      pushToast({ variant: 'error', title: t('room_creation_error') });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoom = async ({
    room,
    roomAlias,
    roomName,
    description,
    ...props
  }: UpdateRoomProps) => {
    setIsLoading(true);

    const isIdentityServerInfoUpdated =
      dirtyFields.roomAlias || dirtyFields.roomName;

    try {
      await editRoom({ room, roomName, roomAlias, description, ...props });

      if (isIdentityServerInfoUpdated) {
        const roomSecret = getRoomSecret(room);
        const payload = {
          ...(dirtyFields.roomName && { room_name: roomName }),
          ...(dirtyFields.roomAlias && { room_alias: roomAlias }),
          ...(dirtyFields.isWaitingListEnabled && {
            waiting_list: props.isWaitingListEnabled,
          }),
          ...(dirtyFields.description && { room_description: description }),
        };

        await updateRoomInIdentityServer(room.roomId, roomSecret, payload);
      }

      remove();
    } catch (error) {
      pushToast({ variant: 'error', title: t('room_creation_error') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = handleSubmit(
    ({ roomAlias, ...props }: RoomFormType) => {
      const alias = `${roomAlias}-${digitsPostfix}`;
      const defaultProps: CreateRoomProps = { roomAlias: alias, ...props };

      if (roomToEdit) return updateRoom({ room: roomToEdit, ...defaultProps });

      return createRoom(defaultProps);
    },
    () => trigger()
  );

  return { handleFormSubmit, isLoading };
};

export default useCreateRoomStep;
