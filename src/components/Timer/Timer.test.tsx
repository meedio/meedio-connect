import { render } from '@testing-library/react';
import add from 'date-fns/add';
import format from 'date-fns/format';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

import Timer from './Timer';

it('should update timer after one minute', () => {
  vi.useFakeTimers();

  const { container } = render(<Timer />);

  const date = new Date();
  const hourFormat = 'HH:mm';

  const currentTime = format(date, hourFormat);
  const timeAfter = format(add(date, { minutes: 1 }), hourFormat);

  expect(container).toHaveTextContent(currentTime);
  act(() => {
    vi.advanceTimersByTime(1000 * 60);
  });
  expect(container).toHaveTextContent(timeAfter);
});
