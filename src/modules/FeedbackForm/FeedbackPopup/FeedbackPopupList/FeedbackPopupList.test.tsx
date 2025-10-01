import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { FeedbackContextProvider, FeedbackContextType } from 'contexts/FeedbackContext/FeedbackContext';
import { FeedbackIssueName } from 'modules/FeedbackForm/utils';

import FeedbackPopupList from './FeedbackPopupList';

const SPINNER = 'SPINNER';
const validFeedbackIssues = Object.values(FeedbackIssueName).map((name, index) => ({
  id: index + 1,
  name,
}));

const mocks = vi.hoisted(() => ({ updateFeedbackAndFinish: vi.fn(), updateFeedback: vi.fn() }));

vi.mock('components/Spinner/Spinner', () => ({ default: vi.fn(() => <div>{SPINNER}</div>) }));
vi.mock('hooks/useUpdateFeedback/useUpdateFeedback', () => ({
  default: vi
    .fn()
    .mockReturnValue({ updateFeedbackAndFinish: mocks.updateFeedbackAndFinish, updateFeedback: mocks.updateFeedback }),
}));

vi.mock(import('../../utils'), async (importOriginal) => {
  const actual = await importOriginal();
  const mockedTranslations = Object.fromEntries(Object.values(actual.FeedbackIssueName).map((v) => [v, v]));

  return { ...actual, getFeedbackTranslations: vi.fn().mockReturnValue(mockedTranslations) };
});

const getWrapper = (customFeedbackContextValues?: Partial<FeedbackContextType>) => {
  const WrapperComponent = ({ children }: PropsWithChildren) => (
    <MemoryRouter>
      <FeedbackContextProvider value={customFeedbackContextValues}>{children}</FeedbackContextProvider>
    </MemoryRouter>
  );

  WrapperComponent.displayName = 'WrapperComponent';
  return WrapperComponent;
};

describe('FeedbackPopupList', () => {
  it('renders Spinner when issueList is not available', () => {
    render(<FeedbackPopupList onClick={vi.fn()} />, { wrapper: getWrapper() });

    expect(screen.getByText(SPINNER)).toBeInTheDocument();
  });

  it('renders all issues', () => {
    render(<FeedbackPopupList onClick={vi.fn()} />, { wrapper: getWrapper({ issueList: validFeedbackIssues }) });

    validFeedbackIssues.forEach(({ name }) => expect(screen.getByText(name)).toBeInTheDocument());
  });

  it('updates feedback and calls onClick when the "other" option is selected', async () => {
    const onClickMock = vi.fn();

    render(<FeedbackPopupList onClick={onClickMock} />, { wrapper: getWrapper({ issueList: validFeedbackIssues }) });

    await userEvent.click(screen.getByText(FeedbackIssueName.OTHER));

    expect(mocks.updateFeedback).toHaveBeenCalledOnce();
    expect(onClickMock).toHaveBeenCalledOnce();
  });

  it('updates feedback and finishes flow when option other than "other" is selected', async () => {
    render(<FeedbackPopupList onClick={vi.fn()} />, { wrapper: getWrapper({ issueList: validFeedbackIssues }) });

    await userEvent.click(screen.getByText(FeedbackIssueName.AUDIO_ECHO));

    expect(mocks.updateFeedbackAndFinish).toHaveBeenCalledOnce();
  });
});
