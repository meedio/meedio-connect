import { v4 as uuid } from 'uuid';

import constants from 'utils/Constants';

export const PING_INTERVAL = 5000;
export const STALE_TIMEOUT = 30000;

/**
 * Getting tabId, if exists in same session, set it, if not, upload id to session storage to allow refresh the main page without losing lock
 * @returns {string}
 * `tabId`
 */
export const getOrCreateTabId = (): string => {
  const tabIdFromSessionStorage = sessionStorage.getItem(constants.SESSION_WINDOW_ID);
  const tabId = tabIdFromSessionStorage || uuid();
  if (!tabIdFromSessionStorage) sessionStorage.setItem(constants.SESSION_WINDOW_ID, tabId);
  return tabId;
};

export const isLockExpired = (ping: number): boolean => Date.now() - ping > STALE_TIMEOUT;
