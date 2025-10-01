import { create, useModal } from '@ebay/nice-modal-react';
import Divider from '@shared/components/Divider/Divider';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ScreenShare } from 'assets/icons/ScreenShare.svg';
import ConfirmationPopup from 'modules/ConfirmationPopup/ConfirmationPopup';

const ScreenSharingDiagnosticModal = create(() => {
  const { t } = useTranslation();
  const { visible, remove, hide, resolve, reject } = useModal(ScreenSharingDiagnosticModal);

  const handleCancel = () => {
    reject();
    hide().then(remove);
  };

  const handleConfirm = () => {
    resolve();
    remove();
  };

  return (
    <ConfirmationPopup onClose={() => null} isVisible={visible}>
      <ConfirmationPopup.Content icon={ScreenShare} iconClassName="text-primary-50" containerClassName="!pb-0">
        {t('screen_sharing_test_description')}
      </ConfirmationPopup.Content>
      <Divider verticalSpace="none" />
      <ConfirmationPopup.Footer>
        <ConfirmationPopup.Button variant="secondaryTertiary" onClick={handleCancel}>
          {t('cancel')}
        </ConfirmationPopup.Button>
        <ConfirmationPopup.Button variant="primary" onClick={handleConfirm}>
          {t('start_screen_sharing')}
        </ConfirmationPopup.Button>
      </ConfirmationPopup.Footer>
    </ConfirmationPopup>
  );
});

export default ScreenSharingDiagnosticModal;
