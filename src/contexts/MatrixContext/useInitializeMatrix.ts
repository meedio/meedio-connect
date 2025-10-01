import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import useMxCookies from 'modules/Authentication/hooks/useMxCookies';

import { InitialMatrixContextType } from './types';
import useMatrixAuthentication from './useMatrixAuthentication';
import useRegisterGuestMatrixAccount from './useRegisterGuestMatrixAccount';
import useStartMatrixClient from './useStartMatrixClient';
import { MatrixLoggingInStatusEnum } from './utils';

const useInitializeMatrix = (matrixContextValue: InitialMatrixContextType) => {
  const { mxUserId, mxDeviceId, mxAccessToken } = useMxCookies();
  const triedToStartRef = useRef(false);
  const [searchParams] = useSearchParams();
  const register = useRegisterGuestMatrixAccount(matrixContextValue);
  const { initiateTokenLogin } = useMatrixAuthentication(matrixContextValue);
  const startMatrixClient = useStartMatrixClient(matrixContextValue);

  const { matrixLoggingInStatus, setMatrixLoggingInStatus, matrixClient, setMatrixUrl, setMatrixHomeserverBaseUrl } =
    matrixContextValue;

  useEffect(() => {
    if (matrixLoggingInStatus === MatrixLoggingInStatusEnum.RUNNING) return;

    const loginToken = searchParams.get('loginToken');
    if (loginToken) {
      initiateTokenLogin(loginToken);
      return;
    }

    if (!mxUserId || !mxDeviceId || !mxAccessToken) {
      setMatrixLoggingInStatus(MatrixLoggingInStatusEnum.RUNNING);
      // Note: If any cookies missing, we reset url's in the local storage
      setMatrixUrl(import.meta.env.REACT_APP_GUEST_MATRIX_URL);
      setMatrixHomeserverBaseUrl(import.meta.env.REACT_APP_GUEST_MATRIX_URL);

      register().finally(() => {
        setMatrixLoggingInStatus(MatrixLoggingInStatusEnum.FINISHED);
      });
      return;
    }

    if (!matrixClient.current && !triedToStartRef.current) {
      setMatrixLoggingInStatus(MatrixLoggingInStatusEnum.RUNNING);
      triedToStartRef.current = true;
      startMatrixClient({ accessToken: mxAccessToken, userId: mxUserId, deviceId: mxDeviceId }).finally(() =>
        setMatrixLoggingInStatus(MatrixLoggingInStatusEnum.FINISHED)
      );
    }
  }, [
    matrixClient,
    matrixLoggingInStatus,
    mxAccessToken,
    mxDeviceId,
    mxUserId,
    initiateTokenLogin,
    register,
    setMatrixLoggingInStatus,
    startMatrixClient,
    setMatrixUrl,
    searchParams,
    setMatrixHomeserverBaseUrl,
  ]);

  return;
};

export default useInitializeMatrix;
