import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import RoomEndedPage from './RoomEndedPage';

const FEEDBACK_FORM_MOCK = 'FEEDBACK_FORM_MOCK';

const mocks = vi.hoisted(() => ({ isEnabled: vi.fn() }));

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return { ...actual, useTranslation: () => ({ t: (key: string) => key }) };
});
vi.mock('modules/FeedbackForm/FeedbackForm', () => ({ default: () => <>{FEEDBACK_FORM_MOCK}</> }));
vi.mock('contexts/FeatureFlagProvider/useFeatureFlagContext', () => ({
  default: vi.fn().mockReturnValue({ isEnabled: mocks.isEnabled }),
}));

describe('RoomEndedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the FeedbackForm when the feature flag is enabled', async () => {
    mocks.isEnabled.mockReturnValue(true);

    render(<RoomEndedPage />, { wrapper: MemoryRouter });

    expect(screen.getByText(FEEDBACK_FORM_MOCK)).toBeInTheDocument();
  });

  it('should hide the FeedbackForm when the feature flag is disabled', () => {
    mocks.isEnabled.mockReturnValue(false);

    render(<RoomEndedPage />, { wrapper: MemoryRouter });

    expect(screen.queryByText(FEEDBACK_FORM_MOCK)).not.toBeInTheDocument();
  });
});
