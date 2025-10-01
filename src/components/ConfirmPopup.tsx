import { create, useModal } from '@ebay/nice-modal-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmationPopup from 'modules/ConfirmationPopup/ConfirmationPopup';
import { IconType } from 'utils/types';

export const boldElement = <span className="font-medium" />;

interface ConfirmPopupProps {
  onConfirm: () => void;
  text: string | ReactNode;
  icon: IconType;
  confirmButtonText: string;
}

const ConfirmPopup = create(({ onConfirm, text, icon, confirmButtonText }: ConfirmPopupProps) => {
  const { t } = useTranslation();
  const { remove, hide, visible } = useModal(ConfirmPopup);

  const handleClose = () => hide().then(remove);
  const handleConfirm = () => {
    onConfirm();
    remove();
  };

  return (
    <ConfirmationPopup onClose={handleClose} isVisible={visible}>
      <ConfirmationPopup.Content icon={icon} iconClassName="text-tertiary-50">
        {text}
      </ConfirmationPopup.Content>
      <ConfirmationPopup.Footer>
        <ConfirmationPopup.Button variant="secondaryTertiary" onClick={handleClose}>
          {t('cancel')}
        </ConfirmationPopup.Button>
        <ConfirmationPopup.Button variant="destructive" onClick={handleConfirm}>
          {confirmButtonText}
        </ConfirmationPopup.Button>
      </ConfirmationPopup.Footer>
    </ConfirmationPopup>
  );
});

export default ConfirmPopup;
