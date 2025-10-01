import debounce from 'lodash/debounce';
import { useCallback, useLayoutEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleResize = useCallback(() => setScreenWidth(window.innerWidth), []);

  useLayoutEffect(() => {
    window.addEventListener('resize', debounce(handleResize, 250));

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return screenWidth < MOBILE_BREAKPOINT;
};
