import { render, screen, waitFor } from '@testing-library/react';
import { Component, PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { FeedbackContextProvider, FeedbackContextType } from 'contexts/FeedbackContext/FeedbackContext';

import FeedbackForm from './FeedbackForm';
import { FeedbackIssueName } from './utils';

const SPINNER = 'SPINNER';

const mocks = vi.hoisted(() => ({ fetchIssues: vi.fn(), setIssueList: vi.fn() }));

vi.mock('contexts/FeedbackContext/FeedbackContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('contexts/FeedbackContext/FeedbackContext')>();
  return {
    ...actual,
    withFeedbackContextProvider: (Component: Component) => Component,
  };
});

vi.mock('components/Spinner/Spinner', () => ({ default: vi.fn(() => <div>{SPINNER}</div>) }));
vi.mock('hooks/useFeedback/useFeedback', () => ({
  default: vi
    .fn()
    .mockReturnValue({ fetchIssues: mocks.fetchIssues.mockResolvedValue([{ id: 1, name: 'mockIssue' }]) }),
}));

vi.mock(import('./utils'), async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, processFeedbackIssues: vi.fn().mockImplementation((issues) => issues) };
});

const getWrapper = (customFeedbackContextValues?: Partial<FeedbackContextType>) => {
  const WrapperComponent = ({ children }: PropsWithChildren) => (
    <MemoryRouter>
      <FeedbackContextProvider value={{ ...customFeedbackContextValues }}>{children}</FeedbackContextProvider>
    </MemoryRouter>
  );

  WrapperComponent.displayName = 'WrapperComponent';
  return WrapperComponent;
};

describe('FeedbackForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders everything correctly on initial render', async () => {
    render(<FeedbackForm />, { wrapper: getWrapper() });

    await waitFor(() => {
      expect(screen.getByText('feedback.title_question')).toBeInTheDocument();
      expect(screen.getByText('feedback.privacy_policy')).toBeInTheDocument();
      expect(screen.getByText('feedback.good')).toBeInTheDocument();
      expect(screen.getByText('feedback.bad')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });
  });

  it('renders everything correctly after feedback is completed', async () => {
    render(<FeedbackForm />, { wrapper: getWrapper({ isFeedbackCompleted: true }) });

    await waitFor(() => {
      expect(screen.getByText('feedback.acknowledgment')).toBeInTheDocument();
      expect(screen.queryByText('feedback.good')).not.toBeInTheDocument();
      expect(screen.queryByText('feedback.bad')).not.toBeInTheDocument();
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
  });

  it('fetches issues on initial render and stores fetched issues in the context', async () => {
    render(<FeedbackForm />, { wrapper: getWrapper({ setIssueList: mocks.setIssueList }) });

    await waitFor(() => {
      expect(mocks.fetchIssues).toHaveBeenCalled();
      expect(mocks.setIssueList).toHaveBeenCalled();
    });
  });

  it('does not fetch issues if there are issues in the context already', async () => {
    render(<FeedbackForm />, { wrapper: getWrapper({ issueList: [{ id: 1, name: FeedbackIssueName.AUDIO_ECHO }] }) });

    await waitFor(() => {
      expect(mocks.fetchIssues).not.toBeCalled();
      expect(mocks.setIssueList).not.toBeCalled();
    });
  });

  it('displays a loading state when loading', async () => {
    render(<FeedbackForm />, { wrapper: getWrapper({ isLoading: true }) });

    await waitFor(() => {
      expect(screen.getByText(SPINNER)).toBeInTheDocument();
      expect(screen.getByText('feedback.loading')).toBeInTheDocument();
    });
  });
});
