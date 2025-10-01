import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { vi, describe, it, expect } from 'vitest';

import { FeedbackContextProvider, FeedbackContextType } from 'contexts/FeedbackContext/FeedbackContext';

import useUpdateFeedback from './useUpdateFeedback';

const mockProperties = { comment: 'mock comment', isSatisfied: true };

const getWrapper = (customFeedbackContextValues?: Partial<FeedbackContextType>) => {
  const WrapperComponent = ({ children }: PropsWithChildren) => (
    <FeedbackContextProvider value={customFeedbackContextValues}>{children}</FeedbackContextProvider>
  );

  WrapperComponent.displayName = 'WrapperComponent';
  return WrapperComponent;
};

const mocks = vi.hoisted(() => ({ updateFeedback: vi.fn(), remove: vi.fn() }));

vi.mock('modules/FeedbackForm/FeedbackPopup/FeedbackPopup', () => ({ default: vi.fn(() => <div />) }));
vi.mock('@ebay/nice-modal-react', () => ({ useModal: () => ({ remove: mocks.remove }) }));
vi.mock('hooks/useFeedback/useFeedback', () => ({
  default: () => ({ updateFeedback: mocks.updateFeedback.mockReturnValue(Promise.resolve()) }),
}));

describe('useUpdateFeedback', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call a update feedback function with correct properties', async () => {
    const { result } = renderHook(() => useUpdateFeedback(), { wrapper: getWrapper() });

    await act(async () => {
      await result.current.updateFeedback({ ...mockProperties });
    });

    expect(mocks.updateFeedback).toBeCalledWith(mockProperties);
  });

  it('should update feedback and finish by setting isFeedbackCompleted to true and removing the modal', async () => {
    const setIsLoadingMock = vi.fn();
    const setIsFeedbackCompletedMock = vi.fn();
    const { result } = renderHook(() => useUpdateFeedback(), {
      wrapper: getWrapper({ setIsFeedbackCompleted: setIsFeedbackCompletedMock, setIsLoading: setIsLoadingMock }),
    });

    await act(async () => {
      await result.current.updateFeedbackAndFinish({ ...mockProperties });
    });

    expect(mocks.updateFeedback).toBeCalledWith(mockProperties);
    expect(mocks.remove).toHaveBeenCalledOnce();
    expect(setIsFeedbackCompletedMock).toBeCalledWith(true);
    expect(setIsLoadingMock).toBeCalledTimes(2);
  });
});
