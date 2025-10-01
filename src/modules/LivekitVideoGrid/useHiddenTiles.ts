import { useEffect } from 'react';

import { isMobileBreakpoint } from 'contexts/VideoGridContext/getTilePositions/utils';
import { LayoutType } from 'contexts/VideoGridContext/utils';
import { HiddenTiles, initialHiddenTiles, useVideoGridContext } from 'contexts/VideoGridContext/VideoGridContext';
import useThrottle from 'hooks/useThrottle';

const endIndicatorHiddenThreshold = 32;
const startIndicatorHiddenThreshold = 16;

const useHiddenTiles = (scrollPosition: number) => {
  const { tiles, tilePositions, gridBounds, setHiddenTiles, layout } = useVideoGridContext();
  const throttledScrollPosition = useThrottle(scrollPosition);

  useEffect(() => {
    if (layout === LayoutType.FREEDOM) return setHiddenTiles(initialHiddenTiles);

    const newHiddenTiles: HiddenTiles = { startHiddenTiles: [], endHiddenTiles: [] };
    const scrollPositionAbs = Math.abs(throttledScrollPosition);
    const isMobile = isMobileBreakpoint(gridBounds.width, gridBounds.height);

    tiles.forEach((tile) => {
      const { order, focused } = tile;
      if (focused) return;

      const { y, x } = tilePositions[order];
      const [relevantAxis, relevantGridBound] = isMobile ? [x, gridBounds.width] : [y, gridBounds.height];

      const tilePosition = relevantAxis - scrollPositionAbs;
      const isHiddenStart = tilePosition + startIndicatorHiddenThreshold < 0;
      const isHiddenEnd = tilePosition + endIndicatorHiddenThreshold > relevantGridBound;

      if (isHiddenStart) newHiddenTiles.startHiddenTiles.push(tile);
      if (isHiddenEnd) newHiddenTiles.endHiddenTiles.push(tile);
    });

    setHiddenTiles(newHiddenTiles);
  }, [gridBounds, layout, setHiddenTiles, throttledScrollPosition, tilePositions, tiles]);
};

export default useHiddenTiles;
