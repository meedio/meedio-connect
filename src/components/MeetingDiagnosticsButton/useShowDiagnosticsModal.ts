import { useModal } from '@ebay/nice-modal-react';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import DiagnosticsConfirmationModal from './DiagnosticsConfirmationModal';

const useShowDiagnosticsModal = (customTranslationKey?: string) => {
  const { show: showDiagnostics } = useModal(DiagnosticsConfirmationModal);
  const { roomId } = useParams();

  const routeToGoBack = `/rooms/${roomId}`;

  const openConfirmationModal = useCallback(() => {
    if (window.location.pathname !== '/test') showDiagnostics({ routeToGoBack, customTranslationKey });
  }, [customTranslationKey, routeToGoBack, showDiagnostics]);

  return openConfirmationModal;
};

export default useShowDiagnosticsModal;
