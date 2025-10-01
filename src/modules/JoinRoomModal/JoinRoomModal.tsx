import { create, useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import InputGroup from '@shared/components/InputGroup/InputGroup';
import Popup from '@shared/components/Popup/Popup';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Rooms } from 'assets/icons/Rooms.svg';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import { getViaServers } from 'utils/matrixUtils';
import { Schemas } from 'utils/yup/schemas/validationSchemas';

import ModalFooter from '../../components/ModalFooter';

type JoinRoomFormType = { roomId: string };

const JoinRoomModal = create(() => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { remove } = useModal(JoinRoomModal);
  const { matrixClient } = useMatrixContext();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<JoinRoomFormType>({
    mode: 'all',
    resolver: yupResolver(Schemas.getJoinMatrixRoom(t)),
    defaultValues: { roomId: '' },
  });
  const navigate = useNavigate();

  const setJoinError = () => {
    setIsLoading(false);
    return setError('roomId', { message: t('room_not_exist') });
  };

  const onSubmit = handleSubmit(async ({ roomId }: JoinRoomFormType) => {
    setIsLoading(true);

    const room = await matrixClient
      .joinRoom(roomId, { viaServers: getViaServers(roomId, matrixClient) })
      .catch(setJoinError);
    if (!room) return setJoinError();

    remove();
    return navigate(`/rooms/${room.roomId}`);
  });

  return (
    <Popup isVisible closePopup={remove}>
      <Popup.FullScreenContainer className="md:w-[512px]">
        <Popup.Header className="md:justify-between">
          {t('join_room')}
          <Popup.CloseIcon closePopup={remove} />
        </Popup.Header>
        <div className="flex grow flex-col overflow-y-auto">
          <div className="flex w-full flex-col space-y-3 p-4">
            <span className="text-sm">
              <Trans i18nKey="room_id_description" components={{ bold: <span className="font-medium" /> }} />
            </span>
            <div className="flex space-x-6">
              <Rooms className="stroke-gray-60 mt-3 h-6 w-6 shrink-0 stroke-1.5" />
              <div className="flex w-full min-w-0 flex-col space-y-2">
                <InputGroup variant="white-bg" errorMessage={errors.roomId?.message}>
                  <Controller
                    name="roomId"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <InputGroup.Input onChange={onChange} value={value} placeholder={t('room_id')} />
                    )}
                  />
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
        <ModalFooter
          onCloseClick={remove}
          successButtonText={t('join_room')}
          onSubmit={onSubmit}
          cancelText={t('cancel')}
          successDisabled={!isValid || !!errors.roomId}
          isLoading={isLoading}
        />
      </Popup.FullScreenContainer>
    </Popup>
  );
});

export default JoinRoomModal;
