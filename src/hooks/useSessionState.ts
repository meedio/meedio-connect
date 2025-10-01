import { useEffect, useState } from 'react';

import logger from 'utils/logging/faro';

export enum SessionStateKeys {}
// Add other session state keys here as needed

/**
 * Hook to retrieve and hold a value from `sessionStorage` in React state with ability to keep the state, while resetting the sessionStorage value.
 *
 * Usage Scenarios:
 * - When you need to pass temporary state between routes or reloads
 * - When you want a piece of state to persist during a session but not beyond
 * - When you need to *read once and forget* (e.g. redirect intents, onboarding state)
 *
 * @param key - The key to read from `sessionStorage`.
 * @param isOneTimeUse - If true, the value will be removed from `sessionStorage` after being read once.
 * @returns A state from `useState`, where the initial value comes from `sessionStorage`.
 */
export const useSessionState = <T>(key: string, isOneTimeUse = false) => {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    const state = sessionStorage.getItem(key);

    if (state) {
      try {
        setState(JSON.parse(state));
      } catch (e) {
        logger.warn('Failed to parse route state:', e);
      }

      if (isOneTimeUse) sessionStorage.removeItem(key);
    }
  }, [key, isOneTimeUse, setState]);

  return state;
};

/**
 * Stores a value in the browser's `sessionStorage` under a given key.
 *
 * The value is serialized to a JSON string before being stored.
 * This allows storage of complex data types like objects and arrays.
 *
 * @template T - The type of the value being stored.
 * @param key - The key under which to store the value.
 * @param value - The value to store, which will be stringified to JSON.
 */
export const setSessionStorageValue = <T = unknown>(key: string, value: T) =>
  sessionStorage.setItem(key, JSON.stringify(value));
