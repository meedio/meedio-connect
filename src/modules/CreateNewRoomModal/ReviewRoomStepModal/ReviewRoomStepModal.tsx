import Popup from '@shared/components/Popup/Popup';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ModalFooter from 'components/ModalFooter';
import testingConstants from 'utils/testingConstants';

import useCreateNewRoomDataContext from '../CreateNewRoomDataProvider/useCreateNewRoomDataContext';
import RoomNameField from '../CreateRoomStepModal/RoomNameField';
import useCreateRoomStep from '../CreateRoomStepModal/useCreateRoomStep';
import { CreateNewRoomStepsEnum } from '../utils';

const ReviewRoomStepModal = () => {
  const { t } = useTranslation();
  const {
    roomToEdit,
    handleExit,
    setCurrentStep,
    roomForm: {
      trigger,
      formState: { isValid },
    },
  } = useCreateNewRoomDataContext();
  const { handleFormSubmit, isLoading } = useCreateRoomStep();

  const handleBack = () => setCurrentStep(CreateNewRoomStepsEnum.CREATE_ROOM);
  const successButtonText = roomToEdit ? t('save') : t('create_room');

  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <Popup isVisible>
      <Popup.FullScreenContainer className='md:w-[512px]'>
        <Popup.Header className='flex-col justify-between !mx-0 px-4 pt-4 !shadow-none !border-none'>
          <div className='flex w-full justify-between'>
            {t('review_room')}
            <Popup.CloseIcon closePopup={handleExit} className='!static' />
          </div>
        </Popup.Header>
        <div
          className='flex flex-col grow overflow-y-auto gap-4 p-4'
          data-testid={testingConstants.reviewRoomStepModal}
        >
          <RoomNameField />
        </div>
        <ModalFooter
          onCloseClick={handleBack}
          onSubmit={handleFormSubmit}
          successButtonText={successButtonText}
          cancelText={t('back')}
          isLoading={isLoading}
          successDisabled={!isValid}
        />
      </Popup.FullScreenContainer>
    </Popup>
  );
};

export default ReviewRoomStepModal;
