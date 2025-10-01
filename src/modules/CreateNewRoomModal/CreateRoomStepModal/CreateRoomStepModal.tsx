import Popup from '@shared/components/Popup/Popup';
import { useTranslation } from 'react-i18next';

import ModalFooter from 'components/ModalFooter';
import testingConstants from 'utils/testingConstants';

import AliasField from './AliasField/AliasField';
import RoomNameField from './RoomNameField';
import useCreateRoomStep from './useCreateRoomStep';
import WaitingListToggleField from './WaitingListToggleField';
import useCreateNewRoomDataContext from '../CreateNewRoomDataProvider/useCreateNewRoomDataContext';
import {
  AliasStatusEnum,
  RoomFormType,
} from '../CreateNewRoomDataProvider/utils';

const currentStepFields: (keyof RoomFormType)[] = [
  'roomName',
  'roomAlias',
  'isWaitingListEnabled',
];

interface CreateRoomStepModalProps {
  onGoBack?: () => void;
}

const CreateRoomStepModal = ({ onGoBack }: CreateRoomStepModalProps) => {
  const { t } = useTranslation();
  const { handleFormSubmit, isLoading } = useCreateRoomStep();
  const {
    handleExit,
    aliasStatus,
    roomToEdit,
    roomForm: {
      formState: { dirtyFields, errors },
    },
  } = useCreateNewRoomDataContext();

  const isWaitingListToggleVisible = true;
  const isFormChanged = !!Object.keys(dirtyFields).length;
  const hasErrorsInCurrentStep = currentStepFields.some(
    (field) => !!errors[field]
  );
  const hasErrors = hasErrorsInCurrentStep;
  const isSuccessDisabled =
    hasErrors || !isFormChanged || aliasStatus !== AliasStatusEnum.AVAILABLE;

  const modalTitle = roomToEdit ? t('edit_room') : t('create_room');
  const submitButtonText = roomToEdit ? t('save') : t('create_room');
  const [handleCancel, cancelText] = onGoBack
    ? [onGoBack, t('back')]
    : [handleExit, t('cancel')];
  const [primaryButtonText, handleSubmit] = [
    submitButtonText,
    handleFormSubmit,
  ];

  return (
    <Popup isVisible>
      <Popup.FullScreenContainer className='md:w-[512px]'>
        <Popup.Header className='flex-col justify-between !mx-0 px-4 pt-4 !shadow-none'>
          <div className='flex w-full justify-between'>
            {modalTitle}
            <Popup.CloseIcon closePopup={handleExit} className='!static' />
          </div>
        </Popup.Header>
        <div
          className='flex flex-col grow overflow-y-auto gap-4 p-4'
          data-testid={testingConstants.createRoomModal}
        >
          <RoomNameField shouldSyncAlias />
          <AliasField />
          {isWaitingListToggleVisible && <WaitingListToggleField />}
        </div>
        <ModalFooter
          onCloseClick={handleCancel}
          onSubmit={handleSubmit}
          successButtonText={primaryButtonText}
          cancelText={cancelText}
          successDisabled={isSuccessDisabled}
          isLoading={isLoading}
          isCancelButtonHidden={false}
        />
      </Popup.FullScreenContainer>
    </Popup>
  );
};

export default CreateRoomStepModal;
