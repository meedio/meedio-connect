import { createClient } from 'matrix-js-sdk/src';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import { getHomeserverBaseUrl } from 'modules/Matrix/utils';
import { authLogger } from 'utils/logging/scopedLogger';

const useInitiateMatrixSSORedirect = () => {
  const { setLoginUrl } = useMatrixContext();

  /**
   * Initiate Matrix SSO redirect
   * @param customMatrixUrl - The custom matrix url to use, if null, the default matrix url will be used
   * @returns redirect to the SSO login page
   */
  const initiateMatrixSSORedirect = async (customMatrixUrl: string | null) => {
    const matrixUrl = customMatrixUrl || import.meta.env.REACT_APP_MATRIX_URL;
    const baseUrl = await getHomeserverBaseUrl(matrixUrl);
    if (!baseUrl) throw new Error(`Failed to get homeserver base url for ${matrixUrl}`);
    setLoginUrl(matrixUrl);

    const authClient = createClient({ baseUrl });
    const { origin } = window.location;
    authLogger.info('user has been redirected to matrix sso');
    window.location.href = authClient.getSsoLoginUrl(origin);
  };

  return initiateMatrixSSORedirect;
};

export default useInitiateMatrixSSORedirect;
