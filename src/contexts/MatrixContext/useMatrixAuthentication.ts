import { createClient } from 'matrix-js-sdk/src';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useStartMatrixClient from 'contexts/MatrixContext/useStartMatrixClient';
import useToast from 'contexts/ToastProvider/useToast';
import useLogout from 'modules/Authentication/hooks/useLogout';
import { getHomeserverBaseUrl } from 'modules/Matrix/utils';
import { authLogger } from 'utils/logging/scopedLogger';

import { InitialMatrixContextType } from './types';
import { MatrixLoggingInStatusEnum } from './utils';

/**
 * Hook for handling Matrix authentication
 *
 * Provides functionality for initiating Matrix SSO redirects and token-based logins
 *
 * @returns initiateTokenLogin - For initiating Matrix token-based logins
 */
const useMatrixAuthentication = (matrixContextValue: InitialMatrixContextType) => {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const startMatrixClient = useStartMatrixClient(matrixContextValue);
  const navigate = useNavigate();
  const logoutGuestSession = useLogout();

  const {
    setMatrixLoggingInStatus,
    setMatrixHomeserverBaseUrl,
    setMatrixUrl,
    loginUrl,
    clearLoginUrl,
    setMxAvatarUrl,
    matrixClient,
  } = matrixContextValue;

  /**
   * Initiate Matrix token-based login, validated loginToken and starts new matrix client with matrix credentials
   * @param loginToken - The login token to use
   * @returns new Matrix client
   */
  const initiateTokenLogin = useCallback(
    async (loginToken: string) => {
      setMatrixLoggingInStatus(MatrixLoggingInStatusEnum.RUNNING);
      const baseUrl = await getHomeserverBaseUrl(loginUrl);
      if (!baseUrl) throw new Error(`Failed to get homeserver base url for ${loginUrl}`);

      setMatrixUrl(loginUrl);
      setMatrixHomeserverBaseUrl(baseUrl);
      authLogger.info(`matrix url and homeserver base url was set - ${loginUrl} and ${baseUrl}`);
      try {
        const authClient = createClient({ baseUrl });
        const params = new URLSearchParams(searchParams);

        // NOTE: removing loginToken from search params to avoid it being used again (like refresh or smth)
        params.delete('loginToken');
        setSearchParams(params);
        authLogger.info('Sending login request');
        const { access_token, device_id, user_id } = await authClient.loginRequest({
          type: 'm.login.token',
          token: loginToken,
        });
        authLogger.info('Sending guest logout request without reload');
        if (matrixClient.current) {
          setMxAvatarUrl('');
          await logoutGuestSession(matrixClient.current, false);
        }

        authLogger.info('Start matrix client with shouldClearStores option');
        const newMatrixClient = await startMatrixClient({
          accessToken: access_token,
          deviceId: device_id,
          userId: user_id,
          shouldClearStores: true,
          tokenLogin: true,
          customUrl: baseUrl,
        });

        setMatrixLoggingInStatus(MatrixLoggingInStatusEnum.FINISHED);
        clearLoginUrl();
        return newMatrixClient;
      } catch (e) {
        setMatrixHomeserverBaseUrl(import.meta.env.REACT_APP_GUEST_MATRIX_URL);
        setMatrixUrl(import.meta.env.REACT_APP_GUEST_MATRIX_URL);
        authLogger.info(
          `Token login failed, so reseting homeserver base url and matrix url values to: ${
            import.meta.env.REACT_APP_GUEST_MATRIX_URL
          }`
        );

        setMatrixLoggingInStatus(MatrixLoggingInStatusEnum.FINISHED);
        authLogger.info(`Matrix logging in status reset: ${MatrixLoggingInStatusEnum.FINISHED}`);
        authLogger.info('Token login failed', e);
        pushToast({ title: t('sso_login_failed'), variant: 'error' });
        navigate('/');
      }
    },
    [
      setMatrixLoggingInStatus,
      loginUrl,
      setMatrixUrl,
      setMatrixHomeserverBaseUrl,
      searchParams,
      setSearchParams,
      setMxAvatarUrl,
      logoutGuestSession,
      matrixClient,
      startMatrixClient,
      clearLoginUrl,
      pushToast,
      t,
      navigate,
    ]
  );

  return { initiateTokenLogin };
};

export default useMatrixAuthentication;
