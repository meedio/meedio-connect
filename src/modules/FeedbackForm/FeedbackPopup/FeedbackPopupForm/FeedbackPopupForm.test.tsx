import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, it, expect } from 'vitest';

import { FEEDBACK_MAX_CHARS } from 'utils/yup/schemas/validationSchemas';

import FeedbackPopupForm from './FeedbackPopupForm';

const mocks = vi.hoisted(() => ({ updateFeedbackAndFinish: vi.fn() }));

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('i18n/config', () => ({ default: { t: (key: string) => key } }));
vi.mock('../FeedbackPopup/FeedbackPopup', () => ({ default: vi.fn(() => <div />) }));
vi.mock('hooks/useUpdateFeedback/useUpdateFeedback', () => ({
  default: vi.fn().mockReturnValue({ updateFeedbackAndFinish: mocks.updateFeedbackAndFinish }),
}));

describe('FeedbackPopupForm', () => {
  const onGoBackMock = vi.fn();

  it('renders the form with required elements and correct states', () => {
    render(<FeedbackPopupForm onGoBack={onGoBackMock} />);

    expect(screen.getByRole('button', { name: /feedback.other/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /feedback.submit/i });

    expect(submitButton).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /feedback.submit/i })).toBeDisabled();
  });

  it('calls onGoBack when "Go Back" button is clicked', async () => {
    render(<FeedbackPopupForm onGoBack={onGoBackMock} />);

    const goBackButton = screen.getByRole('button', { name: /feedback.other/i });
    await userEvent.click(goBackButton);

    expect(onGoBackMock).toHaveBeenCalled();
  });

  it('shows validation error and disables the submit button when input is too long', async () => {
    render(<FeedbackPopupForm onGoBack={onGoBackMock} />);

    const textarea = screen.getByRole('textbox');

    // NOTE: using paste because it takes a lot of time with type
    await userEvent.click(textarea);
    await userEvent.paste(faker.string.alpha({ length: FEEDBACK_MAX_CHARS + 1 }));

    expect(screen.getByText('feedback.too_long')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /feedback.submit/i })).toBeDisabled();
  });

  it('enables the submit button and updates feedback with a correct comment after submitting a valid form', async () => {
    render(<FeedbackPopupForm onGoBack={onGoBackMock} />);

    const feedbackText = 'feedback text';
    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /feedback.submit/i });

    await userEvent.type(textarea, feedbackText);
    expect(submitButton).not.toBeDisabled();

    await userEvent.click(submitButton);
    expect(mocks.updateFeedbackAndFinish).toHaveBeenCalledWith({ comment: feedbackText });
  });
});
