import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ControlButton from './ControlButton';

const fakeWord = faker.word.noun();

it('should do action on click', async () => {
  let i = 0;
  const onClick = () => i++;

  render(
    <ControlButton variant="contrastPrimary" onClick={onClick}>
      {fakeWord}
    </ControlButton>
  );
  const button = screen.getByText(fakeWord);
  expect(button).toBeDefined();

  await userEvent.click(button);

  expect(i).toBe(1);
});

it('disabled state should not let user do actions', async () => {
  let i = 0;
  const onClick = () => i++;

  render(
    <ControlButton variant="contrastPrimary" disabled onClick={onClick}>
      {fakeWord}
    </ControlButton>
  );
  const button = screen.getByText(fakeWord);
  expect(button).toBeDefined();

  await userEvent.click(button);

  expect(i).toBe(0);
});
