import Button from '@shared/components/Button/Button';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as Alert } from 'assets/icons/Alert.svg';
import useToast from 'contexts/ToastProvider/useToast';
import { getCleanPathname } from 'utils/utils';

const useSfuReconnectionActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { pushToast, removeToast, toastState } = useToast();

  const reconnectingToastTitle = t('lost_connection_to_server');
  const toast = useMemo(
    () => toastState.find(({ title }) => title === reconnectingToastTitle),
    [reconnectingToastTitle, toastState]
  );

  const reload = () => window.location.reload();

  const displayToast = useCallback(() => {
    if (toast) return;

    const description = (
      <div className="space-y-1">
        <span>{t('attempting_to_reconnect')}...</span>
        <Button variant="textContrast" className="text-white80 hover:text-white" onClick={reload}>
          {t('refresh_page')}
        </Button>
      </div>
    );

    pushToast({
      autoDismiss: false,
      title: reconnectingToastTitle,
      description,
      variant: 'error',
      icon: Alert,
    });
  }, [pushToast, reconnectingToastTitle, t, toast]);

  const hideToast = useCallback(() => {
    if (toast) removeToast(toast.id);
  }, [removeToast, toast]);

  const navigateToDisconnected = useCallback(
    () => navigate(`${getCleanPathname()}/disconnected${location.search}`),
    [location.search, navigate]
  );

  return { displayToast, hideToast, navigateToDisconnected };
};

export default useSfuReconnectionActions;
