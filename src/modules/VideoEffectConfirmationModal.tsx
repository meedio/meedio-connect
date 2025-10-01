import { create, useModal } from '@ebay/nice-modal-react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as AlertCircle } from 'assets/icons/AlertCircle.svg';

import ConfirmationPopup from './ConfirmationPopup/ConfirmationPopup';

interface VideoEffectConfirmationModalProps {
  onConfirm: () => void;
}

const VideoEffectConfirmationModal = create(({ onConfirm }: VideoEffectConfirmationModalProps) => {
  const { t } = useTranslation();
  const { hide, remove, visible } = useModal(VideoEffectConfirmationModal);

  const handleClose = () => hide().then(remove);

  return (
    <ConfirmationPopup onClose={handleClose} isVisible={visible}>
      <ConfirmationPopup.Content icon={AlertCircle}>{t('effects_cam_off')}</ConfirmationPopup.Content>
      <ConfirmationPopup.Footer>
        <ConfirmationPopup.Button variant="secondaryTertiary" onClick={handleClose}>
          {t('cancel')}
        </ConfirmationPopup.Button>
        <ConfirmationPopup.Button variant="primary" onClick={onConfirm}>
          {t('confirm')}
        </ConfirmationPopup.Button>
      </ConfirmationPopup.Footer>
    </ConfirmationPopup>
  );
});

export default VideoEffectConfirmationModal;
