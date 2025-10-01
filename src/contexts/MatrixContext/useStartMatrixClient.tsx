import { createClient, MatrixError } from 'matrix-js-sdk/src/matrix';
import { IndexedDBStore } from 'matrix-js-sdk/src/store/indexeddb';
import { MemoryStore } from 'matrix-js-sdk/src/store/memory';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import uuid4 from 'uuid4';

import { ReactComponent as Alert } from 'assets/icons/Alert.svg';
import useToast from 'contexts/ToastProvider/useToast';
import useLogout from 'modules/Authentication/hooks/useLogout';
import useMatrixAvatar from 'modules/Authentication/hooks/useMatrixAvatar';
import useMxCookies from 'modules/Authentication/hooks/useMxCookies';
import logger from 'utils/logging/faro';
import { authLogger, storesLogger } from 'utils/logging/scopedLogger';
import { logAndSendToSentry } from 'utils/utils';

import { InitialMatrixContextType } from './types';
import {
  checkMatrixCreds,
  createMatrixStore,
  KNOWN_MATRIX_AUTH_ERRORS,
  startupStores,
} from './utils';

const identityServerToken = uuid4();
const currentMatrixStoresVersion = import.meta.env
  .REACT_APP_MATRIX_STORES_VERSION;

const MAX_RETRY_COUNT = 5;

interface StartMatrixClientProps {
  accessToken: string;
  deviceId: string;
  userId: string;
  tokenLogin?: boolean;
  shouldClearStores?: boolean;
  customUrl?: string;
}

const useStartMatrixClient = (matrixContextValue: InitialMatrixContextType) => {
  const { t } = useTranslation();
  const logout = useLogout();
  const retryCountRef = useRef(0);
  const {
    setMxAccessToken,
    setMxDeviceId,
    setMxUserId,
    setMxDisplayName,
    setMxLoggedIn,
    clearCookies,
    matrixStoresVersion,
    setMatrixStoresVersion,
  } = useMxCookies();
  const { pushToast, removeToast } = useToast();

  const { matrixClient, matrixHomeserverBaseUrl, matrixUrl, setMxAvatarUrl } =
    matrixContextValue;
  const { fetchAvatar } = useMatrixAvatar(matrixClient, setMxAvatarUrl);

  const displayToast = useCallback(() => {
    const reload = () => window.location.reload();

    pushToast({
      autoDismiss: false,
      title: t('errors.something_went_wrong'),
      variant: 'error',
      icon: Alert,
      actionText: t('refresh_page'),
      onAction: reload,
      actionButtonVariant: 'textContrast',
    });
  }, [pushToast, t]);

  const startMatrixClient = async ({
    accessToken,
    deviceId,
    userId,
    customUrl,
    tokenLogin = false,
    shouldClearStores = false,
  }: StartMatrixClientProps) => {
    try {
      const baseUrl = customUrl || matrixHomeserverBaseUrl;

      if (!tokenLogin) await checkMatrixCreds(accessToken, userId, baseUrl);
      const matrixStore = createMatrixStore();

      if (!(matrixStore instanceof IndexedDBStore)) {
        const isMemoryStore = matrixStore instanceof MemoryStore;
        const isUndefined = typeof matrixStore === undefined;

        storesLogger.warn('matrix store is not an instance of IndexedDBStore', {
          isMemoryStore,
          isUndefined,
        });
      }

      matrixClient.current = createClient({
        baseUrl,
        accessToken,
        store: matrixStore,
        userId,
        deviceId,
        useLivekitForGroupCalls: true,
        idBaseUrl: import.meta.env.REACT_APP_IDENTITY_SERVER_URL,
        // NOTE: we don't need an access token for now, but we have to pass it to be able to use threepid methods
        identityServer: { getAccessToken: async () => identityServerToken },
      });

      const hasMatrixStoresVersion = matrixStoresVersion !== undefined;
      //NOTE: if matrixStoresVersion is undefined it's the first time the app is loaded (and hasMatrixStoresVersionChanged is false)
      const hasMatrixStoresVersionChanged =
        hasMatrixStoresVersion &&
        matrixStoresVersion !== currentMatrixStoresVersion;
      if (hasMatrixStoresVersionChanged || !hasMatrixStoresVersion)
        setMatrixStoresVersion(currentMatrixStoresVersion);

      // NOTE: Clearing the stores is necessary to prevent a new user from accessing the previous user's data,
      // because client is initialized with new accessToken, deviceId and if it's guest account - userId
      if (shouldClearStores) {
        // In case indexDB lock bug happens, just offer to refresh the tab
        const warningToastId = 'reload-tab-warning';
        const warningTimeout = setTimeout(() => {
          pushToast({
            title: t('loading_longer_than_usual'),
            description: t('try_reloading_the_page'),
            variant: 'warning',
            autoDismiss: false,
            id: warningToastId,
          });
        }, 5000);

        storesLogger.warn(
          'Clearing stores in startMatrixClient, because shouldClearStores is true'
        );

        await matrixClient.current
          .clearStores()
          .catch((e) =>
            storesLogger.error(
              'failed to clear the stores in startMatrixClient',
              e
            )
          )
          .then(() =>
            storesLogger.info(
              'successfully cleared the matrix stores in startMatrixClient'
            )
          )
          .finally(() => {
            clearTimeout(warningTimeout);
            removeToast(warningToastId);
          });
      }

      //NOTE: If matrix stores version changes we do a full logout and reload. Guest account is lost, while logged in user needs to re-log in
      if (hasMatrixStoresVersionChanged) {
        storesLogger.warn(
          'Clearing stores and fully logging out user in startMatrixClient, because hasMatrixStoresVersionChanged is true.'
        );

        return logout(matrixClient.current);
      }

      await startupStores(matrixClient.current).catch((error) =>
        logger.error('Error in matrix startupStores', error)
      );

      setMxAccessToken(accessToken);
      setMxDeviceId(deviceId);
      setMxUserId(userId);

      await matrixClient.current.startClient({
        clientWellKnownPollPeriod: 60 * 10,
        lazyLoadMembers: true,
      });

      if (
        import.meta.env.REACT_APP_GUEST_MATRIX_URL !== (customUrl || matrixUrl)
      ) {
        const profile = await matrixClient.current.getProfileInfo(userId);
        if (profile) {
          setMxDisplayName(profile.displayname);
          await fetchAvatar(profile.avatar_url);
        }
        setMxLoggedIn(true);
      }

      return matrixClient.current;
    } catch (error) {
      const isUnknownTokenError =
        error instanceof MatrixError &&
        error.data.errcode === 'M_UNKNOWN_TOKEN';
      const isErrorInstance = error instanceof Error;
      const isKnownAuthError =
        isErrorInstance &&
        KNOWN_MATRIX_AUTH_ERRORS.some((msg) => error.message.includes(msg));
      if (isUnknownTokenError || isKnownAuthError) {
        clearCookies();
        return authLogger.warn(
          `Cannot init matrix client - clearing cookies. Error: ${error}`
        );
      }

      if (retryCountRef.current <= MAX_RETRY_COUNT) {
        authLogger.warn(
          `Cannot init matrix client - retrying, attempt: ${retryCountRef.current}, error: ${error}`
        );
        return queueStartClient({
          accessToken,
          deviceId,
          userId,
          customUrl,
          tokenLogin,
          shouldClearStores,
        });
      }

      if (
        isErrorInstance &&
        error.message.includes('fetch failed: Failed to fetch')
      ) {
        return authLogger.warn(`startMatrixClient failed, ${error}`);
      }

      logAndSendToSentry(`startMatrixClient failed, ${error}`);
    }
  };

  const queueStartClient = (props: StartMatrixClientProps) =>
    new Promise((resolve, reject) => {
      if (retryCountRef.current === MAX_RETRY_COUNT) return displayToast();

      retryCountRef.current += 1;

      return setTimeout(() => {
        startMatrixClient(props).then(resolve).catch(reject);
      }, 2000);
    });

  return startMatrixClient;
};

export default useStartMatrixClient;
