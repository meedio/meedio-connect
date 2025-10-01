import useCookies from 'hooks/useCookies';
import constants, { matrixConstants } from 'utils/Constants';

/**
 * Hook for managing Matrix authentication cookies and state
 *
 * Provides access to and control over Matrix-related cookies including:
 * - Matrix Access token for authentication
 * - Matrix Device ID for the current session
 * - Matrix User ID and display name
 * - Matrix Login status
 * - Matrix Auth issuer information
 * - Matrix Display name
 * - Matrix Stores version
 *
 * Also provides method to clear all cookies.
 */
const useMxCookies = () => {
  const [mxAccessToken, setMxAccessToken] = useCookies<string | undefined>(matrixConstants.MX_ACCESS_TOKEN, undefined);
  const [mxDeviceId, setMxDeviceId] = useCookies<string | undefined>(matrixConstants.MX_DEVICE_ID, undefined);
  const [mxUserId, setMxUserId] = useCookies<string | undefined>(matrixConstants.MX_USER_ID, undefined);
  const [mxDisplayName, setMxDisplayName] = useCookies<string | undefined>(matrixConstants.MX_DISPLAY_NAME, undefined);
  const [mxLoggedIn, setMxLoggedIn] = useCookies<boolean | undefined>(matrixConstants.MX_LOGGED_IN, undefined);
  const [matrixStoresVersion, setMatrixStoresVersion] = useCookies<boolean | undefined>(
    constants.MATRIX_STORES_VERSION,
    undefined
  );

  const clearCookies = () => {
    setMxAccessToken(undefined);
    setMxDeviceId(undefined);
    setMxUserId(undefined);
    setMxDisplayName(undefined);
    setMxLoggedIn(undefined);
  };

  return {
    mxAccessToken,
    mxDeviceId,
    mxUserId,
    mxDisplayName,
    mxLoggedIn,
    matrixStoresVersion,
    setMxAccessToken,
    setMxDeviceId,
    setMxUserId,
    setMxDisplayName,
    setMxLoggedIn,
    setMatrixStoresVersion,
    clearCookies,
  };
};

export default useMxCookies;
