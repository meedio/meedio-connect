import { create } from '@ebay/nice-modal-react';

import useCreateNewRoomDataContext from './CreateNewRoomDataProvider/useCreateNewRoomDataContext';
import withCreateNewRoomDataProvider from './CreateNewRoomDataProvider/withCreateNewRoomDataProvider';
import CreateRoomStepModal from './CreateRoomStepModal/CreateRoomStepModal';
import DiscardConfirmationModal from './DiscardConfirmationModal';
import ReviewRoomStepModal from './ReviewRoomStepModal/ReviewRoomStepModal';
import { CreateNewRoomStepsEnum } from './utils';

interface CreateNewRoomModalProps {
  onGoBack?: () => void;
}

const CreateNewRoomModal = create(
  withCreateNewRoomDataProvider(({ onGoBack }: CreateNewRoomModalProps) => {
    const { currentStep } = useCreateNewRoomDataContext();

    if (currentStep === CreateNewRoomStepsEnum.CREATE_ROOM)
      return <CreateRoomStepModal onGoBack={onGoBack} />;
    if (currentStep === CreateNewRoomStepsEnum.REVIEW_ROOM)
      return <ReviewRoomStepModal />;
    if (currentStep === CreateNewRoomStepsEnum.DISCARD)
      return <DiscardConfirmationModal />;

    throw new Error(`Reached unknown currentStep value: ${currentStep}`);
  })
);

export default CreateNewRoomModal;
