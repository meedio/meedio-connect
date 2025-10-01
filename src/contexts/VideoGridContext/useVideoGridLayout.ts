import { useCallback, useRef, useState } from 'react';

import { LayoutType } from './utils';

function useVideoGridLayout() {
  const layoutRef = useRef<LayoutType>(LayoutType.FREEDOM);
  const revertLayoutRef = useRef<LayoutType>(LayoutType.FREEDOM);
  const [, forceUpdate] = useState({});

  const setLayout = useCallback((layoutType: LayoutType) => {
    // Store the user's set layoutType to revert to after a screenshare is finished
    revertLayoutRef.current = layoutType;
    layoutRef.current = layoutType;
    forceUpdate({});
  }, []);

  // Note: We need the returned layoutType to update synchronously with a change in hasScreenshareFeeds
  // so use refs and avoid useEffect.

  layoutRef.current = revertLayoutRef.current;

  return { layout: layoutRef.current, setLayout };
}

export default useVideoGridLayout;
