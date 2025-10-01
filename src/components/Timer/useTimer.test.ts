import { renderHook } from '@testing-library/react-hooks';
import format from 'date-fns/format';

import useTimer from './useTimer';

it('should render correctly', () => {
  const {
    result: {
      current: { date },
    },
  } = renderHook(() => useTimer());
  const monthFormat = 'MM-dd';
  const hourFormat = 'HH:mm';

  const monthAndDay = format(date.current, monthFormat);
  expect(monthAndDay).toBe(format(new Date(), 'MM-dd'));

  const hours = format(date.current, hourFormat);
  expect(hours).toBe(format(new Date(), 'HH:mm'));
});
