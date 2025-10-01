import { create, useModal } from '@ebay/nice-modal-react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { ReactComponent as AlertWarningTriangle } from 'assets/icons/AlertWarningTriangle.svg';
import ConfirmationPopup from 'modules/ConfirmationPopup/ConfirmationPopup';
import testingConstants from 'utils/testingConstants';

const boldElement = <span className="font-medium" />;

type SidebarActionType = 'kick' | 'ban' | 'deny';

interface SidebarActionConfirmationModalProps {
  actionType: SidebarActionType;
  participantName?: string;
  onClick: () => Promise<void | NonNullable<unknown>>;
  onClose?: () => void;
}

const SidebarActionConfirmationModal = create(
  ({ actionType, participantName, onClick, onClose }: SidebarActionConfirmationModalProps) => {
    const { t } = useTranslation();
    const { remove, hide, visible } = useModal(SidebarActionConfirmationModal);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () =>
      hide().finally(() => {
        remove();
        onClose && onClose();
      });

    const handleConfirm = () => {
      setIsLoading(true);

      onClick().finally(() => {
        setIsLoading(false);
        remove();
        onClose && onClose();
      });
    };

    const name = participantName || t('participant');

    return (
      <ConfirmationPopup onClose={handleClose} isVisible={visible}>
        <ConfirmationPopup.Content icon={AlertWarningTriangle} iconClassName="text-tertiary-50">
          <Trans i18nKey={`are_you_sure_${actionType}`} values={{ name }} components={{ bold: boldElement }} />
        </ConfirmationPopup.Content>
        <ConfirmationPopup.Footer>
          <ConfirmationPopup.Button variant="secondaryTertiary" onClick={handleClose}>
            {t('cancel')}
          </ConfirmationPopup.Button>
          <ConfirmationPopup.Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isLoading}
            data-testid={testingConstants.confirmKick}
          >
            {t('confirm')}
          </ConfirmationPopup.Button>
        </ConfirmationPopup.Footer>
      </ConfirmationPopup>
    );
  }
);

export default SidebarActionConfirmationModal;
