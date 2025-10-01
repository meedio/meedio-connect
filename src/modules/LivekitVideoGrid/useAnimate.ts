import { useSprings } from '@react-spring/web';
import { MutableRefObject, useCallback, useRef } from 'react';

import { isMobileBreakpoint } from 'contexts/VideoGridContext/getTilePositions/utils';
import { countWithProperty } from 'contexts/VideoGridContext/layoutUtils';
import { DragTileData, Tile, LayoutType } from 'contexts/VideoGridContext/utils';
import { useVideoGridContext } from 'contexts/VideoGridContext/VideoGridContext';

interface UseAnimateProps {
  draggingTileRef: MutableRefObject<DragTileData | null>;
  scrollPosition: number;
}

const useAnimate = ({ draggingTileRef, scrollPosition }: UseAnimateProps) => {
  const { tiles, tilePositions, layout, gridBounds } = useVideoGridContext();
  const tilePositionsValid = useRef(false);

  const focusedTiles = countWithProperty(tiles, 'focused');

  const animate = useCallback(
    (tiles: Tile[]) => {
      const tilePositionsWereValid = tilePositionsValid.current;

      return (tileIndex: number) => {
        const tile = tiles[tileIndex];
        const tilePosition = tilePositions[tile.order];
        const draggingTile = draggingTileRef.current;
        const dragging = draggingTile && tile.key === draggingTile.key;
        const remove = tile.remove;
        tilePositionsValid.current = (tilePosition && tilePosition.height > 0) || false;

        const from: {
          shadow: number;
          scale: number;
          opacity: number;
          x?: number;
          y?: number;
          width?: number;
          height?: number;
        } = { shadow: 1, scale: 0, opacity: 0 };
        const reset = !tilePositionsWereValid;

        const isMobile = isMobileBreakpoint(gridBounds.width, gridBounds.height);

        const x =
          tilePosition.x +
          (layout === LayoutType.SPOTLIGHT && tile.order > focusedTiles - 1 && isMobile ? scrollPosition : 0);
        const y =
          tilePosition.y +
          (layout === LayoutType.SPOTLIGHT && tile.order > focusedTiles - 1 && !isMobile ? scrollPosition : 0);

        const defaultTileState = {
          x,
          y,
          width: tilePosition.width,
          height: tilePosition.height,
          scale: remove ? 0 : 1,
          opacity: remove ? 0 : 1,
          zIndex: tilePosition.zIndex,
          shadow: 1,
          from,
          reset,
          immediate: (key: string) => key === 'zIndex' || key === 'shadow',
          delay: (key: string) => (key === 'zIndex' ? 500 : 0),
        };

        if (dragging) {
          if (!tile.draggable) return defaultTileState;

          return {
            width: tilePosition.width,
            height: tilePosition.height,
            x: draggingTile.offsetX + draggingTile.x,
            y: draggingTile.offsetY + draggingTile.y,
            scale: 1.1,
            opacity: 1,
            zIndex: 2,
            shadow: 15,
            immediate: (key: string) => key === 'zIndex' || key === 'x' || key === 'y' || key === 'shadow',
            from: {
              shadow: 0,
              scale: 0,
              opacity: 0,
            },
            reset: false,
          };
        }

        if (!tilePositionsWereValid) {
          from.x = x;
          from.y = y;
          from.width = tilePosition.width;
          from.height = tilePosition.height;
        }

        return defaultTileState;
      };
    },
    [tilePositions, draggingTileRef, gridBounds, layout, focusedTiles, scrollPosition],
  );

  const [springs, api] = useSprings(tiles.length, animate(tiles), [tilePositions, tiles, scrollPosition]);

  return { animate, springs, api };
};

export default useAnimate;
