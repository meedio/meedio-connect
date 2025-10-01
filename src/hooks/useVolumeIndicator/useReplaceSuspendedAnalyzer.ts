import { useEffect, useRef } from 'react';

import useEventListener from 'hooks/useEventListener/useEventListener';
import { Timeout } from 'utils/types';

const useReplaceSuspendedIndicator = (analyser: AnalyserNode | undefined, setNewAnalyser: () => void) => {
  const timeoutRef = useRef<Timeout>();

  // NOTE: browsers might suspend audioContext if we try to initialize it while user is in another tab.
  // We need a user gesture to resume it (e.g. button click), so we just set a new one.
  // Also it wont work without a timeout, it might be running too soon without it.
  useEventListener('focus', () => {
    if (analyser?.context.state !== 'suspended') return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(setNewAnalyser, 50);
  });

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );
};

export default useReplaceSuspendedIndicator;
