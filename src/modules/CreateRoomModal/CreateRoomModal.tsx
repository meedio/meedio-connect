import { create, useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from '@shared/components/ErrorMessage/ErrorMessage';
import Input from '@shared/components/InputGroup/Input';
import InputGroup from '@shared/components/InputGroup/InputGroup';
import Popup from '@shared/components/Popup/Popup';
import Switch from '@shared/components/Switch/Switch';
import cx from 'classnames';
import { JoinRule, Room } from 'matrix-js-sdk/src/matrix';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as LinkNew } from 'assets/icons/LinkNew.svg';
import { ReactComponent as Loader } from 'assets/icons/Loader.svg';
import { ReactComponent as Refresh } from 'assets/icons/Refresh.svg';
import { ReactComponent as Rooms } from 'assets/icons/Rooms.svg';
import { ReactComponent as Users } from 'assets/icons/Users.svg';
import TextInput from 'components/TextInput/TextInput';
import constants from 'Constants';
import useCreateMeeting from 'hooks/useCreateMeeting/useCreateMeeting';
import useIsRoomAliasAvailable from 'hooks/useIsRoomAliasAvailable';
import testingConstants from 'utils/testingConstants';
import { RoomMetadataContent } from 'utils/types';
import { getFormError } from 'utils/utils';
import { Schemas } from 'utils/yup/schemas/validationSchemas';

import AliasAvailable from './AliasAvailable';
import AliasNotAvailable from './AliasNotAvailable';
import { CreateRoomProps, UpdateRoomProps } from './types';
import useAliasForm from './useAliasForm';
import useEditMatrixRoom from './useEditMatrixRoom';
import { getAndExtractAlias, getDigitsFromRoomAlias } from './utils';
import ModalFooter from '../../components/ModalFooter';

export type CreateRoomFormType = {
  roomTitle: string;
  roomAlias: string;
  isWaitingListEnabled: boolean;
  description?: string;
};

type CreateRoomModalProps = {
  room?: Room;
  roomMetadata?: RoomMetadataContent;
  onGoBack?: () => void;
};

const CreateRoomModal = create(
  ({ room, roomMetadata, onGoBack }: CreateRoomModalProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { remove } = useModal();
    const initialAlias = getAndExtractAlias(room) || '';

    const {
      control,
      handleSubmit,
      watch,
      getValues,
      trigger,
      getFieldState,
      reset,
      clearErrors,
      setValue,
      formState: { errors, isValid, dirtyFields },
    } = useForm<CreateRoomFormType>({
      mode: 'all',
      resolver: yupResolver(Schemas.getCreateRoom()),
      defaultValues: {
        roomTitle: room?.name || '',
        roomAlias: initialAlias,
        isWaitingListEnabled: room?.getJoinRule() === JoinRule.Knock,
        description: roomMetadata?.description || '',
      },
    });
    const { editRoom, isEditLoading } = useEditMatrixRoom({ dirtyFields });
    const { createMeeting, isLoading } = useCreateMeeting();

    const [watchRoomAlias] = watch(['roomAlias']);
    const aliasError = getFormError(errors, 'roomAlias');
    const { isAliasAvailable, aliasCheckLoading, digitsPostfix } =
      useIsRoomAliasAvailable({
        hasError: !!aliasError,
        alias: watchRoomAlias,
        initialDigitsPostfix: getDigitsFromRoomAlias(room),
        originalAlias: initialAlias,
      });
    const {
      onTitleChange,
      onAliasChange,
      matchTitleAndAlias,
      setHasAliasChanged,
      isMatching,
    } = useAliasForm({
      getValues,
      setValue,
      clearErrors,
      trigger,
      watch,
      aliasInputName: 'roomAlias',
      titleInputName: 'roomTitle',
    });
    const isChanged = !!Object.keys(dirtyFields).length;

    const descriptionError = errors.description;
    const roomAliasValue = `${getValues('roomAlias')}-${digitsPostfix}`;
    const isRefreshAvailable =
      !isMatching && !aliasCheckLoading && getValues('roomTitle');
    const AliasRefreshIcon = (isRefreshAvailable && Refresh) || undefined;
    const [AliasIcon, aliasIconOnClick] = aliasCheckLoading
      ? [Loader]
      : [AliasRefreshIcon, matchTitleAndAlias];
    const modalTitle = room ? t('edit_room') : t('create_room');

    const closeModal = useCallback(() => {
      reset();
      remove();
      setHasAliasChanged(false);
    }, [remove, reset, setHasAliasChanged]);

    const handleRoomEdit = useCallback(
      async ({
        room,
        roomTitle,
        isWaitingListEnabled,
        alias,
        description,
      }: UpdateRoomProps) => {
        await editRoom({
          roomAlias: alias,
          roomTitle,
          room,
          isWaitingListEnabled,
          description,
        });
        closeModal();
      },
      [editRoom, closeModal]
    );

    const handleRoomCreate = useCallback(
      async ({
        roomTitle,
        isWaitingListEnabled,
        alias,
        description,
      }: CreateRoomProps) => {
        const newRoom = await createMeeting({
          alias,
          isWaitingListEnabled,
          description,
          title: roomTitle,
        });
        if (!newRoom) return;

        remove();
        navigate(`/rooms/${alias}`);
      },
      [createMeeting, remove, navigate]
    );

    const onSubmit = handleSubmit(
      async ({
        roomTitle,
        roomAlias,
        isWaitingListEnabled,
        description,
      }: CreateRoomFormType) => {
        const alias = `${roomAlias}-${digitsPostfix}`;

        if (room)
          return handleRoomEdit({
            room,
            roomTitle,
            isWaitingListEnabled,
            alias,
            description,
          });

        return handleRoomCreate({
          roomTitle,
          isWaitingListEnabled,
          alias,
          description,
        });
      }
    );

    const isAliasAndTitleValid =
      !getFieldState('roomAlias').invalid ||
      !getFieldState('roomTitle').invalid;
    const isSuccessDisabled = !isValid || !isChanged || !isAliasAvailable;

    return (
      <Popup isVisible closePopup={closeModal}>
        <Popup.FullScreenContainer className='md:w-[512px]'>
          <Popup.Header className='md:justify-between'>
            {modalTitle}
            <Popup.CloseIcon closePopup={closeModal} />
          </Popup.Header>
          <div
            className='flex grow flex-col overflow-y-auto'
            data-testid={testingConstants.createRoomModal}
          >
            <div className='flex w-full flex-col space-y-4 p-4'>
              <div className='flex space-x-6'>
                <Rooms className='stroke-gray-60 mt-3 h-6 w-6 shrink-0 stroke-1.5' />
                <div className='flex w-full min-w-0 flex-col space-y-2'>
                  <InputGroup
                    variant='white-bg'
                    errorMessage={errors.roomTitle?.message}
                  >
                    <Controller
                      name='roomTitle'
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <InputGroup.Input
                          onChange={onTitleChange(onChange)}
                          value={value}
                          placeholder={t('room_name')}
                          data-testid={testingConstants.roomTitle}
                        />
                      )}
                    />
                  </InputGroup>
                </div>
              </div>
              <div className='flex space-x-6'>
                <LinkNew className='stroke-gray-60 mt-3 h-6 w-6 shrink-0 stroke-1.5' />
                <div className='flex w-full min-w-0 flex-col space-y-2'>
                  <span className='text-sm font-light text-grayscale-black'>
                    {t('room_alias_explanation')}
                  </span>
                  <div className='flex space-x-2'>
                    <Controller
                      name='roomAlias'
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          variant='white-bg'
                          onChange={onAliasChange(onChange)}
                          containerClassName='!w-3/4'
                          hasError={isAliasAvailable === false || !!aliasError}
                          value={value.toLowerCase()}
                          placeholder={t('enter_room_name_dashed')}
                          icon={AliasIcon}
                          onIconClick={aliasIconOnClick}
                          iconClassName={cx({
                            'animate-spin': aliasCheckLoading,
                          })}
                        />
                      )}
                    />
                    <Input
                      variant='white-bg'
                      containerClassName='!w-36'
                      disabled
                      value={digitsPostfix}
                    />
                  </div>
                  {isAliasAndTitleValid ? (
                    !aliasCheckLoading && isAliasAvailable === false ? (
                      <AliasNotAvailable alias={roomAliasValue} />
                    ) : (
                      <AliasAvailable alias={roomAliasValue} />
                    )
                  ) : null}
                  <ErrorMessage message={aliasError} />
                </div>
              </div>
              <div className='flex space-x-6'>
                <Users className='stroke-gray-60 h-6 w-6 shrink-0 stroke-1.5' />
                <div className='flex justify-between w-full'>
                  <span className='text-body-lg text-black'>
                    {t('waiting_list')}
                  </span>
                  <Controller
                    name='isWaitingListEnabled'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Switch checked={!!value} onChange={onChange} />
                    )}
                  />
                </div>
              </div>
              <div className='flex space-x-6'>
                <div className='w-full flex flex-col space-y-2'>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        id='description'
                        value={value}
                        hasError={!!descriptionError}
                        maxLength={constants.MAX_TOPIC_LENGTH + 1}
                        onChange={onChange}
                        placeholder={t('description_placeholder')}
                      />
                    )}
                  />
                  {!!descriptionError?.message && (
                    <ErrorMessage message={descriptionError.message} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <ModalFooter
            onCloseClick={onGoBack || closeModal}
            onSubmit={onSubmit}
            successButtonText={modalTitle}
            cancelText={onGoBack ? t('back') : t('cancel')}
            successDisabled={isSuccessDisabled}
            isLoading={isLoading || isEditLoading}
          />
        </Popup.FullScreenContainer>
      </Popup>
    );
  }
);

export default CreateRoomModal;
