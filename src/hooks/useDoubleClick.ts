import { MouseEvent, useRef, useCallback, useEffect } from 'react';

import { Timeout } from 'utils/types';

type ElementMouseEventHandler = (e: MouseEvent<Element>) => void;

interface UseDoubleClickProps {
  latency?: number;
  onSingleClick?: ElementMouseEventHandler;
  onDoubleClick?: ElementMouseEventHandler;
}

const useDoubleClick = ({ latency = 300, onSingleClick, onDoubleClick }: UseDoubleClickProps) => {
  const clickRef = useRef(0);
  const timeoutRef = useRef<Timeout | null>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      clickRef.current += 1;

      timeoutRef.current = setTimeout(() => {
        if (clickRef.current === 1 && onSingleClick && e.nativeEvent.detail === 1) {
          onSingleClick(e);
        } else if (timeoutRef.current && clickRef.current === 2 && onDoubleClick) {
          onDoubleClick(e);
        }

        clickRef.current = 0;
      }, latency);
    },
    [latency, onSingleClick, onDoubleClick]
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  return handleClick;
};

export default useDoubleClick;
