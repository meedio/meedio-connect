import { useCallback, useEffect, useRef, useState } from 'react';
import { clearInterval, setInterval } from 'worker-timers';

import useLocalStorage from 'hooks/useLocalStorage/useLocalStorage';
import constants from 'utils/Constants';

import useTabBroadcastChannel from './useTabBroadcastChannel';
import { getOrCreateTabId, isLockExpired, PING_INTERVAL } from './utils';

/**
 * Hook detects whether the current tab is main tab,
 * attempts to automatically reclaim main tab if it main ping expires,
 * handles force-claiming the main tab via cross-tab communication.
 *
 * @returns {Object}
 * - `isMainTab` (`React.MutableRefObject<boolean>`)
 * - `forceClaimTab` (`() => void`): Function for force-claiming tab
 * - `isOutdatedRef` (`React.MutableRefObject<boolean>`): For cutting off tab usage after force-claim
 */
const useSingleTabGuard = () => {
  const [mainTabId, setMainTabId] = useLocalStorage<string | null>(constants.MAIN_WINDOW_ID, null, true);
  const [tabLockPing, setTabLockPing] = useLocalStorage<number | null>(constants.MAIN_WINDOW_PING, null, true);
  const tabId = getOrCreateTabId();

  const isMainTabRef = useRef(tabId === mainTabId);
  const pingRef = useRef<number | null>();
  const isOutdatedRef = useRef<boolean>(false);
  const isIntervalActiveRef = useRef<boolean>(false);

  const [isMainTab, setIsMainTab] = useState(isMainTabRef.current);

  const onForceClaim = useCallback(
    (senderTabId: string) => {
      if (senderTabId === tabId) return;
      isOutdatedRef.current = true;
      sessionStorage.removeItem(constants.SESSION_WINDOW_ID);
      setIsMainTab(false);
    },
    [tabId]
  );

  const claimTab = useCallback(() => {
    if (document.visibilityState !== 'visible') return;
    setMainTabId(tabId);
    setTabLockPing(Date.now());
    setIsMainTab(true);
  }, [setMainTabId, tabId, setTabLockPing]);

  const { sendForceClaim } = useTabBroadcastChannel({ tabId, onForceClaim });
  const forceClaimTab = useCallback(() => {
    sendForceClaim();
    claimTab();
  }, [claimTab, sendForceClaim]);

  useEffect(() => {
    pingRef.current = tabLockPing;
  }, [tabLockPing]);

  useEffect(() => {
    isMainTabRef.current = isMainTab;
  }, [isMainTab]);

  useEffect(() => {
    const unload = () => setTabLockPing(null);
    if (isMainTab) window.addEventListener('unload', unload);

    return () => {
      window.removeEventListener('unload', unload);
    };
  }, [isMainTab, setTabLockPing]);

  useEffect(() => {
    const checkLock = () => {
      if (isOutdatedRef.current) return;
      if (isMainTabRef.current) return setTabLockPing(Date.now());

      const isTabLockExpired = isLockExpired(pingRef.current || 0);
      if (isTabLockExpired) claimTab();
    };

    let interval: number;
    if (!isIntervalActiveRef.current) {
      checkLock();
      isIntervalActiveRef.current = true;
      interval = setInterval(checkLock, PING_INTERVAL);
    }

    return () => {
      isIntervalActiveRef.current = false;
      clearInterval(interval);
    };
  }, [claimTab, setTabLockPing]);

  return { isMainTab, forceClaimTab, isOutdatedRef };
};

export default useSingleTabGuard;
