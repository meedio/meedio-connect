import { useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';
import { isSafari } from 'utils/browsers';
import logger from 'utils/logging/faro';

import useMxCookies from './useMxCookies';

/**
 * Use manage account hook for opening the account management settings
 * Fetches auth metadata from matrix client
 * Opens the account management settings in a new tab
 */
const useManageAccount = () => {
  const { mxUserId } = useMxCookies();
  const { matrixClient } = useMatrixContext();
  const { pushToast } = useToast();
  const { t } = useTranslation();

  const openManageAccount = async () => {
    try {
      const oidcClientConfig = await matrixClient.getAuthMetadata();
      if (!oidcClientConfig?.account_management_uri) throw new Error('Failed to account management url');

      // NOTE: safari does not support window.open
      if (isSafari) return window.location.assign(oidcClientConfig.account_management_uri);

      window.open(oidcClientConfig.account_management_uri);
    } catch {
      logger.error('Failed to open account management settings', { mxUserId, mxHomeserver: matrixClient.baseUrl });
      pushToast({ title: t('cant_open_account_management'), variant: 'error' });
    }
  };

  return openManageAccount;
};

export default useManageAccount;
