import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, expect, beforeEach } from 'vitest';

import logger from 'utils/logging/faro';

import useCancelableFetch from './useCancelableFetch';

const mocks = vi.hoisted(() => ({
  abort: vi.fn(),
  fetch: vi.fn(),
}));

vi.mock('utils/logging/faro', () => ({ default: { info: vi.fn() } }));

declare global {
  interface Window {
    fetch: typeof mocks.fetch;
  }
}

global.AbortController = vi.fn(() => ({
  abort: mocks.abort,
  signal: {} as AbortSignal,
})) as unknown as typeof AbortController;

global.fetch = mocks.fetch;

describe('useCancelableFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('aborts previous request when called again', () => {
    const { result } = renderHook(() => useCancelableFetch({ input: 'url' }));
    mocks.fetch.mockImplementation(() => new Promise(() => {}) as Promise<Response>);

    act(() => {
      result.current();
    });
    act(() => {
      result.current();
    });

    expect(mocks.abort).toHaveBeenCalledTimes(1);
  });

  it('aborts fetch on beforeunload event', () => {
    const { result } = renderHook(() => useCancelableFetch({ input: 'url' }));

    act(() => {
      result.current();
    });

    window.dispatchEvent(new Event('beforeunload'));

    expect(mocks.abort).toHaveBeenCalledTimes(1);
  });

  it('calls onError when fetch fails', async () => {
    const error = new Error('Fetch failed');
    mocks.fetch.mockRejectedValueOnce(error);
    const onError = vi.fn();

    const { result } = renderHook(() => useCancelableFetch({ input: 'url', onError }));

    await act(async () => {
      await result.current();
    });

    expect(onError).toHaveBeenCalledWith(error);
  });

  it('returns parsed JSON on successful fetch', async () => {
    const mockData = { key: 'value' };
    const mockResponse = new Response(JSON.stringify(mockData));
    mocks.fetch.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCancelableFetch({ input: 'url' }));

    let data: unknown;
    await act(async () => {
      data = await result.current();
    });

    expect(data).toEqual(mockData);
  });

  it('aborts fetch and removes event listener on unmount', () => {
    const addListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { result, unmount } = renderHook(() => useCancelableFetch({ input: 'url' }));

    act(() => {
      result.current();
    });

    unmount();

    const handler = addListenerSpy.mock.calls.find((call) => call[0] === 'beforeunload')?.[1];

    expect(removeListenerSpy).toHaveBeenCalledWith('beforeunload', handler);
    expect(mocks.abort).toHaveBeenCalledTimes(1);
  });

  it('returns null and logs info on AbortError', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    mocks.fetch.mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => useCancelableFetch({ input: 'url' }));

    let data: unknown;
    await act(async () => {
      data = await result.current();
    });

    expect(data).toBeNull();
    expect(logger.info).toHaveBeenCalled();
  });
});
