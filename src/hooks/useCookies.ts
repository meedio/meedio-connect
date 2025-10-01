import Cookies from 'js-cookie';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import useEventListener from './useEventListener/useEventListener';

export type SetValue<T> = Dispatch<SetStateAction<T>>;

const domains = {
  // NOTE: when in safari, change it to dev.test
  CUSTOM_LOCALHOST: 'dev.localhost',
  DEV: 'meedio.net',
  STAG: 'meedio.net',
  PROD: 'meedio.eu',
  DEVOPS_TEST: 'meedeo.com',
};

const url = window.location.host;
const [staticDomain] = Object.values(domains).filter((domain) => url.includes(domain));

export const cookieDomain = import.meta.env.REACT_APP_COOKIE_DOMAIN || staticDomain;

function useCookies<T>(key: string, initialValue: T): [T, SetValue<T>, () => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = Cookies.get(key);
      return item ? (parseJSON(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading cookies key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValueRef = useRef<SetValue<T>>();

  setValueRef.current = (value) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      if (!JSON.stringify(newValue)) Cookies.remove(key, { domain: cookieDomain });
      else Cookies.set(key, JSON.stringify(newValue), { domain: cookieDomain, expires: 365 });
      setStoredValue(newValue);
      window.dispatchEvent(new Event('cookies-changed'));
    } catch (error) {
      console.warn(`Error setting cookies key “${key}”:`, error);
    }
  };

  const setValue: SetValue<T> = useCallback((value) => setValueRef.current?.(value), []);
  const resetValue = useCallback(() => setValueRef.current?.(initialValue), [initialValue]);

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCookiesChanged = useCallback(() => setStoredValue(readValue()), [readValue]);

  useEventListener('cookies-changed', handleCookiesChanged);

  return [storedValue, setValue, resetValue];
}

export default useCookies;

export const parseJSON = <T>(value: string | null): T | undefined => {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '');
  } catch (error) {
    return undefined;
  }
};
