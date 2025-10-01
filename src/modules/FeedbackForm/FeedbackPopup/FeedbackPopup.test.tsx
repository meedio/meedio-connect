import NiceModal from '@ebay/nice-modal-react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import FeedbackPopup from './FeedbackPopup';

const FEEDBACK_LIST = 'FEEDBACK_LIST';
const GO_BACK = 'GO_BACK';

vi.mock('./FeedbackPopupList/FeedbackPopupList', () => ({
  default: ({ onClick }: { onClick: () => void }) => <button onClick={onClick}>{FEEDBACK_LIST}</button>,
}));

vi.mock('./FeedbackPopupForm/FeedbackPopupForm', () => ({
  default: ({ onGoBack }: { onGoBack: () => void }) => <button onClick={onGoBack}>{GO_BACK}</button>,
}));

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('FeedbackPopup', () => {
  it('toggles between FeedbackPopupList and FeedbackPopupForm', async () => {
    render(<NiceModal.Provider />);

    act(() => {
      NiceModal.show(FeedbackPopup);
    });

    const listButton = screen.getByText(FEEDBACK_LIST);
    expect(listButton).toBeInTheDocument();

    await userEvent.click(listButton);
    const goBackButton = screen.getByText(GO_BACK);
    expect(goBackButton).toBeInTheDocument();

    await userEvent.click(goBackButton);
    expect(screen.getByText(FEEDBACK_LIST)).toBeInTheDocument();
  });
});
