import { Root, Indicator } from '@radix-ui/react-progress';
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { Interval } from '../../types/sharedTypes';

interface CountdownProgressProps {
  duration: number;
  onComplete: () => void;
  trackClassName: string;
  barClassName: string;
}

const ToastProgressBar = ({ duration, onComplete, trackClassName, barClassName }: CountdownProgressProps) => {
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<Interval>();
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (duration <= 0) return setProgress(0);

    timerRef.current = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - 100 / duration));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [duration]);

  useEffect(() => {
    if (progress === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
      onCompleteRef.current();
    }
  }, [progress]);

  return (
    <Root value={progress} className={cx('absolute bottom-0 left-0 w-full h-[5px]', trackClassName)}>
      <Indicator
        className={cx('h-full transition-all duration-1000 ease-linear rounded', barClassName)}
        style={{ width: `${progress}%` }}
      />
    </Root>
  );
};

export default ToastProgressBar;
