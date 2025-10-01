import { RefObject } from 'react';

import useEventListener from './useEventListener/useEventListener';

type Handler = () => void;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: Handler): void {
  const onClickOutside = (event: Event): void => {
    const el = ref?.current;

    if (!el || el.contains(event.target as Node)) return;

    handler();
  };

  useEventListener('mousedown', onClickOutside);
  useEventListener('touchstart', onClickOutside);
}

export default useOnClickOutside;
