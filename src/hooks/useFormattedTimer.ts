import diffInMs from 'date-fns/differenceInMilliseconds';
import diffInSecs from 'date-fns/differenceInSeconds';
import intervalToDuration from 'date-fns/intervalToDuration';
// Removed GraphQL dependency - using simple type instead
type Maybe<T> = T | null | undefined;
import { useEffect, useState } from 'react';
import { useIntervalWhen } from 'rooks';

export const zeroPad = (num = 0) => String(num).padStart(2, '0');

export const formatDurationToTimerFormat = (
  durationInSeconds: number,
  stripHours = false
) => {
  const { hours, minutes, seconds } = intervalToDuration({
    start: 0,
    end: durationInSeconds * 1000,
  });

  const hour = zeroPad(hours);
  const minute = zeroPad(minutes);
  const second = zeroPad(seconds);

  if (stripHours && hours === 0) return `${minute}:${second}`;

  return `${hour}:${minute}:${second}`;
};

function useFormattedTimer(
  initialTime: Maybe<string> | Date | undefined,
  stripHours = false
) {
  const getInitialTimeInSeconds = () =>
    diffInSecs(new Date(), new Date(initialTime || 0));

  const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState(
    getInitialTimeInSeconds()
  );
  const [shouldStart, setShouldStart] = useState(false);

  // NOTE: this syncs time correctly, for example if there are two timers visible in the same page
  useEffect(() => {
    if (shouldStart) return;

    const timeDiffInMs = diffInMs(new Date(), new Date(initialTime || 0));
    const msUntilNextSecond = 1000 - (timeDiffInMs % 1000);

    const syncTime = () => {
      setElapsedTimeInSeconds((elapsedTime) => elapsedTime + 1);
      setShouldStart(true);
    };

    const timeout = setTimeout(syncTime, msUntilNextSecond);

    return () => clearTimeout(timeout);
  }, [initialTime, shouldStart]);

  useIntervalWhen(
    () => setElapsedTimeInSeconds(getInitialTimeInSeconds()),
    1000,
    shouldStart
  );

  return formatDurationToTimerFormat(elapsedTimeInSeconds, stripHours);
}

export default useFormattedTimer;
