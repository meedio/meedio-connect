import { create, useModal } from '@ebay/nice-modal-react';
import { Trans, useTranslation } from 'react-i18next';

import { ReactComponent as HangUp } from 'assets/icons/HangUp.svg';
import ConfirmationPopup from 'modules/ConfirmationPopup/ConfirmationPopup';
import testingConstants from 'utils/testingConstants';

const boldElement = <span className="font-medium" />;

interface HangupConfirmPopupProps {
  onConfirm: () => void;
  roomName: string;
}

const HangupConfirmPopup = create(({ onConfirm, roomName }: HangupConfirmPopupProps) => {
  const { t } = useTranslation();
  const { remove, hide, visible } = useModal(HangupConfirmPopup);

  const handleClose = () => hide().then(remove);
  const handleConfirm = () => {
    onConfirm();
    remove();
  };

  return (
    <ConfirmationPopup onClose={handleClose} isVisible={visible}>
      <ConfirmationPopup.Content icon={HangUp} iconClassName="text-tertiary-50">
        <Trans i18nKey="end_call_title" components={{ bold: boldElement }} values={{ room: roomName }} />
      </ConfirmationPopup.Content>
      <ConfirmationPopup.Footer>
        <ConfirmationPopup.Button variant="secondaryTertiary" onClick={handleClose}>
          {t('stay')}
        </ConfirmationPopup.Button>
        <ConfirmationPopup.Button
          variant="destructive"
          onClick={handleConfirm}
          data-testid={testingConstants.leaveMeeting}
        >
          {t('leave')}
        </ConfirmationPopup.Button>
      </ConfirmationPopup.Footer>
    </ConfirmationPopup>
  );
});

export default HangupConfirmPopup;
