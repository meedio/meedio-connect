import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as useCopy from 'hooks/useCopy';
import testingConstants from 'utils/testingConstants';
import { toastWrapper } from 'utils/testUtils';

import CopyButton from './CopyButton';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

it('should copy text on copy icon click when button has text and icon and stopPropagation is false', async () => {
  let text = '';
  let isCopied = false;
  const copyLink = faker.string.uuid();
  const useCopyMock = vi.spyOn(useCopy, 'default');

  useCopyMock.mockImplementation(() => ({
    copy: () => {
      isCopied = true;
      return new Promise<void>(() => (text = copyLink));
    },
    isCopied,
  }));

  render(<CopyButton link={copyLink} />, { wrapper: toastWrapper });
  const button = screen.getByTestId(testingConstants.copyButtonIcon);
  await userEvent.click(button);
  expect(isCopied).toBeTruthy();
  expect(text).toBe(copyLink);
  vi.clearAllMocks();
});
