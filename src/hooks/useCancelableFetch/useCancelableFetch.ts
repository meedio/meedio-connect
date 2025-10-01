import { useCallback, useEffect, useRef } from 'react';

import logger from 'utils/logging/faro';

type CancelableFetchOptions = {
  input: RequestInfo | URL;
  init?: RequestInit;
  onError?: (error: Error | unknown) => void;
};

type CancelableFetchResult<T> = () => Promise<void | null | T>;

const useCancelableFetch = <T>({ input, init, onError }: CancelableFetchOptions) => {
  const controllerRef = useRef<AbortController | null>(null);

  const cancelableFetch: CancelableFetchResult<T> = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort();

    controllerRef.current = new AbortController();

    const fetchInit = {
      ...init,
      signal: controllerRef.current.signal,
    };

    let url: string;
    let method: string;

    if (typeof input === 'string' || input instanceof URL) {
      url = input.toString();
      method = fetchInit.method ?? 'GET';
    } else {
      url = input.url;
      method = fetchInit.method ?? input.method ?? 'GET';
    }

    return fetch(input, fetchInit)
      .catch((error) => {
        if (error.name === 'AbortError') {
          logger.info(`Fetch has been cancelled: ${{ url, method }}`);
          return;
        }

        if (onError) return onError(error);

        throw error;
      })
      .then((result) => {
        if (result instanceof Response) return result.json();

        // NOTE: Fetch was canceled; returning null for the hook consumer to handle appropriately
        return null;
      });
  }, [init, input, onError]);

  useEffect(() => {
    const abortFetch = () => {
      if (controllerRef.current) controllerRef.current.abort();
    };

    window.addEventListener('beforeunload', abortFetch);

    return () => {
      window.removeEventListener('beforeunload', abortFetch);
      abortFetch();
    };
  }, []);

  return cancelableFetch;
};

export default useCancelableFetch;
