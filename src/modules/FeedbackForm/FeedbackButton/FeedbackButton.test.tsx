import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropsWithChildren } from 'react';
import { vi } from 'vitest';

import { FeedbackContextProvider, FeedbackContextType } from 'contexts/FeedbackContext/FeedbackContext';
import ModalProvider from 'contexts/ModalProvider/ModalProvider';

import FeedbackButton from './FeedbackButton';

const SPINNER = 'SPINNER';
const FEEDBACK_POPUP = 'FEEDBACK_POPUP';

const mocks = vi.hoisted(() => ({ sendFeedback: vi.fn(), updateFeedback: vi.fn() }));

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('react-router-dom', () => ({ useLocation: vi.fn().mockReturnValue({ pathname: vi.fn(), search: vi.fn() }) }));
vi.mock('components/Spinner/Spinner', () => ({ default: vi.fn(() => <div>{SPINNER}</div>) }));
vi.mock('../FeedbackPopup/FeedbackPopup', () => ({ default: vi.fn(() => <div>{FEEDBACK_POPUP}</div>) }));
vi.mock('hooks/useFeedback/useFeedback', () => ({
  default: () => ({
    sendFeedback: mocks.sendFeedback,
    updateFeedback: mocks.updateFeedback.mockReturnValue(Promise.resolve()),
  }),
}));

const getWrapper = (customFeedbackContextValues?: Partial<FeedbackContextType>) => {
  const WrapperComponent = ({ children }: PropsWithChildren) => (
    <ModalProvider>
      <FeedbackContextProvider value={customFeedbackContextValues}>{children}</FeedbackContextProvider>
    </ModalProvider>
  );

  WrapperComponent.displayName = 'WrapperComponent';
  return WrapperComponent;
};

describe('FeedbackButton', () => {
  it('renders correctly for the "good" variant', () => {
    render(<FeedbackButton variant="good" />, { wrapper: getWrapper() });

    expect(screen.getByText('feedback.good')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('renders correctly for the "bad" variant', () => {
    render(<FeedbackButton variant="bad" />, { wrapper: getWrapper() });

    expect(screen.getByText('feedback.bad')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.getByRole('img')).toHaveClass('rotate-180');
  });

  it('displays a spinner while loading', async () => {
    mocks.sendFeedback.mockReturnValueOnce(new Promise(() => {}));
    render(<FeedbackButton variant="good" />, { wrapper: getWrapper() });

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(screen.getByText(SPINNER)).toBeInTheDocument();
  });

  it('sends correct feedback and displays a modal when the "bad" button is clicked', async () => {
    mocks.sendFeedback.mockReturnValueOnce(Promise.resolve());
    render(<FeedbackButton variant="bad" />, { wrapper: getWrapper() });

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mocks.sendFeedback).toBeCalledWith({ isSatisfied: false });
    expect(screen.getByText(FEEDBACK_POPUP)).toBeInTheDocument();
  });

  it('sends correct feedback and does not display a modal when the "good" button is clicked', async () => {
    mocks.sendFeedback.mockReturnValueOnce(Promise.resolve());
    render(<FeedbackButton variant="good" />, { wrapper: getWrapper() });

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mocks.sendFeedback).toBeCalledWith({ isSatisfied: true });
    expect(screen.queryByText(FEEDBACK_POPUP)).not.toBeInTheDocument();
  });

  it('updates the feedback when the "good" button is clicked after a bad feedback is sent already', async () => {
    mocks.sendFeedback.mockReturnValueOnce(Promise.resolve());
    render(<FeedbackButton variant="good" />, { wrapper: getWrapper({ isBadFeedbackSent: true }) });

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mocks.updateFeedback).toBeCalledWith({ isSatisfied: true });
    expect(screen.queryByText(FEEDBACK_POPUP)).not.toBeInTheDocument();
  });
});
