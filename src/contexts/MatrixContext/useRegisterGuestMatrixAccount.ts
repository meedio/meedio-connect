import { createClient, InteractiveAuth, MatrixClient } from 'matrix-js-sdk/src/matrix';
import { useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import uuid4 from 'uuid4';

import useToast from 'contexts/ToastProvider/useToast';
import { authLogger } from 'utils/logging/scopedLogger';

import { InitialMatrixContextType } from './types';
import useStartMatrixClient from './useStartMatrixClient';

const useRegisterGuestMatrixAccount = (matrixContextValue: InitialMatrixContextType) => {
  const { t } = useTranslation();
  const authClient = useRef<MatrixClient>();
  const { pushToast } = useToast();
  const startMatrixClient = useStartMatrixClient(matrixContextValue);

  const register = useCallback(async () => {
    authClient.current = createClient({
      baseUrl: import.meta.env.REACT_APP_GUEST_MATRIX_URL,
    });

    const interactiveAuth = new InteractiveAuth({
      matrixClient: authClient.current!,
      doRequest: (auth) =>
        authClient.current!.registerRequest({
          password: uuid4(),
          auth: auth || undefined,
        }),
      stateUpdated: (nextStage, { error }) => {
        if (error) throw new Error(error);
        if (nextStage === 'm.login.dummy') interactiveAuth.submitAuthDict({ type: 'm.login.dummy' });
      },
      requestEmailToken: () => Promise.resolve({ sid: 'dummy' }),
    });

    const { user_id, access_token, device_id } = await interactiveAuth.attemptAuth();
    if (!access_token || !device_id) return pushToast({ variant: 'error', title: t('errors.something_went_wrong') });

    authLogger.info('Start guest matrix client with shouldClearStores option');
    const matrixClient = await startMatrixClient({
      customUrl: import.meta.env.REACT_APP_GUEST_MATRIX_URL,
      accessToken: access_token,
      deviceId: device_id,
      userId: user_id,
      shouldClearStores: true,
    });

    return matrixClient;
  }, [pushToast, startMatrixClient, t]);

  return register;
};

export default useRegisterGuestMatrixAccount;
