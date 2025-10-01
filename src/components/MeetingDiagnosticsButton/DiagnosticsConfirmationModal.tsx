import { create, useModal } from '@ebay/nice-modal-react';
import Divider from '@shared/components/Divider/Divider';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as Heartbeat } from 'assets/icons/Heartbeat.svg';
import ConfirmationPopup from 'modules/ConfirmationPopup/ConfirmationPopup';

import { DiagnosticsNavigateFunction } from './utils';

interface DiagnosticsConfirmationModalProps {
  routeToGoBack?: string;
  customTranslationKey?: string;
}

const DiagnosticsConfirmationModal = create(
  ({ routeToGoBack, customTranslationKey }: DiagnosticsConfirmationModalProps) => {
    const { t } = useTranslation();
    const { visible, remove } = useModal(DiagnosticsConfirmationModal);
    const navigate: DiagnosticsNavigateFunction = useNavigate();
    const { search } = useLocation();

    const translationKey = customTranslationKey || 'diagnostics_page_confirmation_description';
    const goBackRouteWithQueryParams = routeToGoBack + search;

    const handleConfirm = () => {
      navigate('/test', {
        state: { goBackRoute: goBackRouteWithQueryParams },
      });
      remove();
    };

    return (
      <ConfirmationPopup onClose={remove} isVisible={visible}>
        <ConfirmationPopup.Content icon={Heartbeat} iconClassName="text-primary-50" containerClassName="!pb-0">
          <Trans i18nKey={translationKey} components={{ bold: <span className="font-medium" /> }} />
        </ConfirmationPopup.Content>
        <Divider verticalSpace="none" />
        <ConfirmationPopup.Footer>
          <ConfirmationPopup.Button variant="secondaryTertiary" onClick={remove}>
            {t('cancel')}
          </ConfirmationPopup.Button>
          <ConfirmationPopup.Button variant="primary" onClick={handleConfirm}>
            {t('confirm')}
          </ConfirmationPopup.Button>
        </ConfirmationPopup.Footer>
      </ConfirmationPopup>
    );
  }
);

export default DiagnosticsConfirmationModal;
