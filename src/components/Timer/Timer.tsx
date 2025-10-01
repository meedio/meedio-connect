import cx from 'classnames';
import format from 'date-fns/format';

import useTimer from './useTimer';

const variants = {
  light: 'text-white60 border-white60',
  dark: 'text-gray-60 border-gray-40',
};

export type TimerVariantType = keyof typeof variants;

interface TimerProps {
  className?: string;
  variant?: TimerVariantType;
}

const Timer = ({ className, variant = 'light' }: TimerProps) => {
  const { timeRef, date } = useTimer();

  const currentTime = format(date.current, 'HH:mm');
  const currentDate = format(date.current, 'dd-MM');

  return (
    <div
      className={cx(
        'text-size-sm inline-flex w-max cursor-auto items-center space-x-2 rounded-2xl border md:px-4 md:py-[13px]',
        variants[variant],
        className
      )}
    >
      <span ref={timeRef}>{currentTime}</span>
      <span>&bull;</span>
      <span>{currentDate}</span>
    </div>
  );
};

export default Timer;
