import { IndexedDBCryptoStore } from 'matrix-js-sdk/src/crypto/store/indexeddb-crypto-store';
import { LocalStorageCryptoStore } from 'matrix-js-sdk/src/crypto/store/localStorage-crypto-store';
import { MemoryCryptoStore } from 'matrix-js-sdk/src/crypto/store/memory-crypto-store';
import { createClient, MatrixClient } from 'matrix-js-sdk/src/matrix';
import { IndexedDBStore } from 'matrix-js-sdk/src/store/indexeddb';
import { MemoryStore } from 'matrix-js-sdk/src/store/memory';

import { storesLogger } from 'utils/logging/scopedLogger';

const indexedDB = global.indexedDB;
const localStorage = global.localStorage;
const USER_NOT_MATCHING_MESSAGE = 'Matrix user does not match with the user in storage';
const DEVICE_ID_NO_MATCH_ERROR = "the account in the store doesn't match the account in the constructor";
export const KNOWN_MATRIX_AUTH_ERRORS = [USER_NOT_MATCHING_MESSAGE, DEVICE_ID_NO_MATCH_ERROR];

export const createMatrixStore = (): IndexedDBStore | MemoryStore | undefined => {
  if (indexedDB && localStorage) {
    return new IndexedDBStore({ indexedDB, localStorage, dbName: 'web-sync-store' });
  } else if (localStorage) {
    return new MemoryStore({ localStorage });
  } else {
    storesLogger.error('Failed to create a store in createIndexedDBStore');
  }
};

export const startupStores = async (matrixClient: MatrixClient | null) => {
  if (!matrixClient) return;

  for (const dbType of ['indexeddb', 'memory']) {
    try {
      const promise = matrixClient.store.startup();
      await promise;
      break;
    } catch (err) {
      if (dbType !== 'indexeddb') throw err;

      matrixClient.store = new MemoryStore({ localStorage });
    }
  }
};

export const createCryptoStore = () => {
  if (indexedDB) {
    return new IndexedDBCryptoStore(global.indexedDB, 'crypto-store');
  } else if (localStorage) {
    return new LocalStorageCryptoStore(localStorage);
  } else {
    return new MemoryCryptoStore();
  }
};

export const checkMatrixCreds = async (accessToken: string, userId: string, baseUrl: string) => {
  const client = createClient({ baseUrl });
  client.setAccessToken(accessToken);

  const { user_id } = await client.whoami();

  // NOTE: reject promise if user id in cookies does not match user id from whoami response
  if (userId !== user_id) throw new Error(USER_NOT_MATCHING_MESSAGE);
};

export enum MatrixLoggingInStatusEnum {
  INITIAL = 'initial',
  RUNNING = 'running',
  FINISHED = 'finished',
}
