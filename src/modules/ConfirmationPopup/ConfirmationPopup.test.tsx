import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ConfirmationPopup from './ConfirmationPopup';

it('modal should handle outside click', async () => {
  const onClose = vi.fn();
  render(
    <ConfirmationPopup isVisible onClose={onClose}>
      <button>{faker.word.verb()}</button>
    </ConfirmationPopup>
  );

  await userEvent.click(document.body);
  expect(onClose).toHaveBeenCalled();
});
