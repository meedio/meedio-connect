import { useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { useTranslation } from 'react-i18next';

import useCreateNewRoomDataContext from './CreateNewRoomDataProvider/useCreateNewRoomDataContext';
import { CreateNewRoomStepsEnum } from './utils';

const DiscardConfirmationModal = () => {
  const { t } = useTranslation();
  const { remove } = useModal();
  const { setCurrentStep } = useCreateNewRoomDataContext();

  const handleCancel = () => {
    setCurrentStep(CreateNewRoomStepsEnum.CREATE_ROOM);
  };

  return (
    <Popup
      className='!h-auto !py-0 !m-auto px-4'
      isVisible
      isViewportScrollable
    >
      <Popup.Container className='md:w-[340px] !my-4'>
        <div className='flex flex-col grow overflow-y-auto gap-4 p-4'>
          <p className='font-medium'>{t('discard_unsaved_changes_question')}</p>
          <p>{t('discard_unsaved_changes_description')}</p>
          <div className='border-gray-20 flex flex-col w-full border-t pt-4 gap-4'>
            <Button variant='secondaryTertiary' onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button variant='destructive' onClick={remove}>
              {t('discard')}
            </Button>
          </div>
        </div>
      </Popup.Container>
    </Popup>
  );
};

export default DiscardConfirmationModal;
