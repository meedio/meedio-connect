import { faker } from '@faker-js/faker';
import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { vi, describe, it, expect } from 'vitest';

import { FeedbackContextProvider } from 'contexts/FeedbackContext/FeedbackContext';

const tokenMock = 'test-token';
const urlMock = 'test-url';
const metadataMock = { some: 'metadata' };
const uuidMock = faker.string.uuid();

const mocks = vi.hoisted(() => ({ cancelableFetch: vi.fn().mockReturnValue(vi.fn()), logAndSendToSentry: vi.fn() }));

vi.mock('utils/utils', () => ({ logAndSendToSentry: mocks.logAndSendToSentry }));
vi.mock('../useCancelableFetch/useCancelableFetch', () => ({ default: mocks.cancelableFetch }));
vi.mock('hooks/useFeedbackData/useFeedbackData', () => ({ default: () => metadataMock }));

vi.stubEnv('REACT_APP_FEEDBACK_TOKEN', tokenMock);
vi.stubEnv('REACT_APP_FEEDBACK_URL', urlMock);

const CustomProvider = ({ children }: PropsWithChildren) => (
  <FeedbackContextProvider value={{ participantIdentifier: uuidMock }}>{children}</FeedbackContextProvider>
);

describe('useFeedback', () => {
  const mockFetch = vi.fn();
  mockFetch.mockResolvedValue('ok');
  global.fetch = mockFetch;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call useCancelableFetch with correct URL, headers and pass an onError handler during the fetchIssues call', async () => {
    // Need to import after stubbing the envs
    const { default: useFeedback } = await import('./useFeedback');
    const { result } = renderHook(() => useFeedback(), { wrapper: CustomProvider });

    await act(async () => {
      await result.current.fetchIssues();
    });

    expect(mocks.cancelableFetch).toHaveBeenCalledWith({
      input: `${urlMock}/issues`,
      init: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Feedback-Submit-Token': tokenMock,
        },
      },
      onError: expect.any(Function),
    });
  });

  it('should call logAndSendToSentry when the error occurs during the fetchIssues call', async () => {
    // Need to import after stubbing the envs
    const { default: useFeedback } = await import('./useFeedback');

    const testError = new Error('Test error');
    mocks.cancelableFetch.mockImplementation(
      ({ onError }) =>
        () =>
          onError(testError)
    );

    const { result } = renderHook(() => useFeedback(), { wrapper: CustomProvider });

    await act(async () => {
      await result.current.fetchIssues();
    });

    expect(mocks.logAndSendToSentry).toHaveBeenCalled();
  });

  it('should send feedback with correct properties', async () => {
    // Need to import after stubbing the envs
    const { default: useFeedback } = await import('./useFeedback');
    const { result } = renderHook(() => useFeedback(), { wrapper: CustomProvider });

    await act(async () => {
      await result.current.sendFeedback({ isSatisfied: true });
    });

    expect(mockFetch).toHaveBeenCalledWith(`${urlMock}/submit/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Feedback-Submit-Token': tokenMock,
      },
      body: JSON.stringify({
        satisfied: true,
        uuid: uuidMock,
        metadata: metadataMock,
      }),
    });
  });

  it('should update feedback with correct properties', async () => {
    // Need to import after stubbing the envs
    const { default: useFeedback } = await import('./useFeedback');
    const { result } = renderHook(() => useFeedback(), { wrapper: CustomProvider });

    const comment = 'Feedback comment';
    const issueId = faker.number.int(10);

    await act(async () => {
      await result.current.updateFeedback({ isSatisfied: true, comment, issueId });
    });

    expect(mockFetch).toHaveBeenCalledWith(`${urlMock}/submit/report`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Feedback-Submit-Token': tokenMock,
      },
      body: JSON.stringify({
        satisfied: true,
        uuid: uuidMock,
        comment,
        issue_id: issueId,
        metadata: metadataMock,
      }),
    });
  });
});
