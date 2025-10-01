import { MatrixClient } from 'matrix-js-sdk/src';

import { authLogger, storesLogger } from 'utils/logging/scopedLogger';

import useMxCookies from './useMxCookies';

/**
 * Use logout hook for logging out of the matrix account
 * Clears the matrix session, indexDB, cookies and the matrix client
 * Reloads the page after logging out
 * @returns logout function
 */
const useLogout = () => {
  const { clearCookies } = useMxCookies();

  const clearAllIndexedDB = async () => {
    if (window.indexedDB && window.indexedDB.databases) {
      const dbs = await window.indexedDB.databases();
      await Promise.all(dbs.map((db) => db.name && window.indexedDB.deleteDatabase(db.name)));
    }
  };

  const logout = async (matrixClient: MatrixClient, reload = true) => {
    authLogger.info('Logout started');
    authLogger.info('Clearing cookies');
    clearCookies();

    authLogger.info('Logging out of the matrixClient and stopping the client');
    await matrixClient.logout(true);

    storesLogger.warn('clearing the matrix stores in logout');
    await matrixClient
      .clearStores()
      .catch((e) => storesLogger.error('failed to clear the stores in logout', e))
      .then(() => storesLogger.info('successfully cleared the matrix stores in logout'));

    authLogger.info('Clearing all IndexedDB');
    await clearAllIndexedDB();

    authLogger.info('Logout completed, reloading page');
    if (reload) window.location.reload();
  };

  return logout;
};

export default useLogout;
