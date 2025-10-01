import { FullGestureState, useDrag, useGesture } from '@use-gesture/react';
import { Key, useCallback, useEffect, useRef, useState } from 'react';

import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { getTilePositions } from 'contexts/VideoGridContext/getTilePositions/getTilePositions';
import { GAP, isMobileBreakpoint } from 'contexts/VideoGridContext/getTilePositions/utils';
import { countWithProperty } from 'contexts/VideoGridContext/layoutUtils';
import { reorderTiles } from 'contexts/VideoGridContext/reorderTiles';
import { DragTileData, getPipGap, LayoutType, TileTypeEnum } from 'contexts/VideoGridContext/utils';
import { useVideoGridContext } from 'contexts/VideoGridContext/VideoGridContext';
import constants from 'utils/Constants';

import useAnimate from './useAnimate';
import useHiddenTiles from './useHiddenTiles';
import { isCursorInside } from './utils';

const { PARTICIPANT_DETAILS_ID, ZOOM_CONTROLS_ID, RECORDING_CONTROLS_ID } = constants;
const excludedElementIds = `#${ZOOM_CONTROLS_ID}, #${PARTICIPANT_DETAILS_ID}, #${RECORDING_CONTROLS_ID}`;

const useGestures = () => {
  const {
    setTileState,
    pipXRatio,
    pipYRatio,
    setPipXRatio,
    setPipYRatio,
    tiles,
    tilePositions,
    gridBounds,
    layout,
    setLayout,
    hiddenTiles,
  } = useVideoGridContext();
  const [isTileDragging, setIsTileDragging] = useState(false);
  const {
    state: { isSpotlightSidebarVisible, isLocalViewFloating },
  } = useRoomUIContext();
  const lastTappedRef = useRef<{ [index: string | number]: number }>({});
  const draggingTileRef = useRef<DragTileData | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { animate, springs, api } = useAnimate({ draggingTileRef, scrollPosition });
  useHiddenTiles(scrollPosition);

  const onTap = useCallback(
    (tileKey: Key) => {
      const tile = tiles.find(({ key }) => key === tileKey);
      if (!tile || isLocalViewFloating) return;

      const tileKeyStr = String(tileKey);
      const lastTapped = lastTappedRef.current[tileKeyStr];

      if (!lastTapped || Date.now() - lastTapped > 500) {
        lastTappedRef.current[tileKeyStr] = Date.now();
        return;
      }

      lastTappedRef.current[tileKeyStr] = 0;
      const { item } = tile;

      setTileState(({ tiles, ...state }) => {
        const newTiles = tiles.map((tile) => {
          const focused = tile.item === item ? !tile.focused : tile.focused;

          return { ...tile, focused };
        });

        const tilesInSpotlightCount = countWithProperty(newTiles, 'focused');

        setLayout((tilesInSpotlightCount > 0 && LayoutType.SPOTLIGHT) || LayoutType.FREEDOM);
        reorderTiles(newTiles, isLocalViewFloating);

        return {
          ...state,
          tiles: newTiles,
          tilePositions: getTilePositions({
            tilesCount: newTiles.length,
            tilesInSpotlightCount,
            gridWidth: gridBounds.width,
            gridHeight: gridBounds.height,
            pipXRatio,
            pipYRatio,
            layout,
            isLocalViewFloating,
            isSpotlightSidebarVisible,
          }),
        };
      });
    },
    [
      gridBounds.height,
      gridBounds.width,
      isLocalViewFloating,
      isSpotlightSidebarVisible,
      layout,
      pipXRatio,
      pipYRatio,
      setLayout,
      setTileState,
      tiles,
    ],
  );

  const bindTile = useDrag(
    ({ args: [key], active, xy, movement, tap, last, event }) => {
      const dragTileIndex = tiles.findIndex((tile) => tile.key === key);
      const dragTile = tiles[dragTileIndex];
      const eventTarget = event.target as HTMLElement;

      const isMobile = isMobileBreakpoint(gridBounds.width, gridBounds.height);
      const isExcluded = !!eventTarget.closest(excludedElementIds) && !draggingTileRef.current;
      const isSpotlight = layout === LayoutType.SPOTLIGHT;
      const isDisabledMobileDrag =
        isMobile && isSpotlight && !tap && !dragTile.focused && !isLocalViewFloating && !isTileDragging;

      if (isExcluded || isDisabledMobileDrag) return;

      setIsTileDragging(active);
      event.preventDefault();

      const resetTiles = () => {
        draggingTileRef.current = null;
        api.start(animate(tiles));
      };

      if (tap) {
        //NOTE: it is possible to tap while dragging is still active, in this case we reset draggingTileRef and animate tiles back
        if (draggingTileRef.current) resetTiles();

        return onTap(key);
      }

      //NOTE: it is possible that user disconnects while dragging is still active, in this case we reset draggingTileRef and animate tiles back
      if (!dragTile) return resetTiles();

      const dragTilePosition = tilePositions[dragTile.order];
      const cursorPosition = { x: xy[0] - gridBounds.left, y: xy[1] - gridBounds.top };

      let newTiles = tiles;

      if (isLocalViewFloating) {
        const isRemoteParticipant = dragTile.item.type === TileTypeEnum.PARTICIPANT && !dragTile.item.isLocal;
        const isPlaceholder = dragTile.item.type === TileTypeEnum.PLACEHOLDER;

        if (isRemoteParticipant || isPlaceholder) return;
        if (last) {
          const remotePosition = tilePositions[1];

          const pipGap = getPipGap(gridBounds.width / gridBounds.height, gridBounds.width);
          const pipMinX = remotePosition.x + pipGap;
          const pipMinY = remotePosition.y + pipGap;
          const pipMaxX = remotePosition.x + remotePosition.width - dragTilePosition.width - pipGap;
          const pipMaxY = remotePosition.y + remotePosition.height - dragTilePosition.height - pipGap;

          const newPipXRatio = (dragTilePosition.x + movement[0] - pipMinX) / (pipMaxX - pipMinX);
          const newPipYRatio = (dragTilePosition.y + movement[1] - pipMinY) / (pipMaxY - pipMinY);

          setPipXRatio(Math.max(0, Math.min(1, newPipXRatio)));
          setPipYRatio(Math.max(0, Math.min(1, newPipYRatio)));
        }
      } else {
        const hoverTile = tiles.find(
          (tile) =>
            tile.key !== key &&
            isCursorInside(cursorPosition, tilePositions[tile.order], scrollPosition, isMobile, tile.focused),
        );

        if (hoverTile && dragTile.draggable) {
          newTiles = newTiles.map((tile) => {
            let order = tile.order;
            if (order < dragTile.order) {
              if (order >= hoverTile.order) order++;
            } else if (order > dragTile.order) {
              if (order <= hoverTile.order) order--;
            } else {
              order = hoverTile.order;
            }

            const isHoverTile = tile === hoverTile;
            const isDragTile = tile === dragTile;
            const focused =
              (isHoverTile && dragTile.focused) ||
              (isDragTile && hoverTile.focused) ||
              (!isHoverTile && !isDragTile && tile.focused);

            return { ...tile, order, focused };
          });

          reorderTiles(newTiles, isLocalViewFloating);
          setTileState((state) => ({ ...state, tiles: newTiles }));
        }
      }

      if (active) {
        if (!draggingTileRef.current) {
          const offsetX = isMobile && !dragTile.focused ? dragTilePosition.x + scrollPosition : dragTilePosition.x;
          const offsetY = isMobile || dragTile.focused ? dragTilePosition.y : dragTilePosition.y + scrollPosition;

          draggingTileRef.current = {
            key: dragTile.key,
            offsetX,
            offsetY,
            x: movement[0],
            y: movement[1],
          };
        } else {
          draggingTileRef.current.x = movement[0];
          draggingTileRef.current.y = movement[1];
        }
      } else {
        draggingTileRef.current = null;
      }

      api.start(animate(newTiles));
    },
    { filterTaps: true, pointer: { buttons: [1], capture: false }, eventOptions: { passive: false } },
  );

  const onGridGesture = useCallback(
    (e: Omit<FullGestureState<'wheel'>, 'event'> | Omit<FullGestureState<'drag'>, 'event'>, isWheel: boolean) => {
      if (layout !== LayoutType.SPOTLIGHT) return;

      const isMobile = isMobileBreakpoint(gridBounds.width, gridBounds.height);

      let movement = e.delta[isMobile ? 0 : 1];

      if (isWheel) movement = -movement;

      const lastTile = tilePositions[tilePositions.length - 1];
      const min = isMobile
        ? gridBounds.width - lastTile.x - lastTile.width - GAP
        : gridBounds.height - lastTile.y - lastTile.height - GAP;

      if (!isTileDragging) setScrollPosition((scrollPosition) => Math.min(Math.max(movement + scrollPosition, min), 0));
    },
    [gridBounds.height, gridBounds.width, isTileDragging, layout, tilePositions],
  );

  const isMobile = isMobileBreakpoint(gridBounds.width, gridBounds.height);
  const tilesInSpotlightCount = countWithProperty(tiles, 'focused');
  const sidebarTiles = tilePositions.slice(tilesInSpotlightCount);

  const getIsEnoughSpaceForTiles = useCallback(() => {
    // NOTE: initialize a variable ant count how many gaps we will have
    let totalSizeOfSidebarTiles = (sidebarTiles.length - 1) * GAP;

    // NOTE: add sidebar tiles width/height to total size
    sidebarTiles.forEach(({ width, height }) => (totalSizeOfSidebarTiles += isMobile ? width : height));

    const isEnoughSpace = isMobile
      ? gridBounds.width >= totalSizeOfSidebarTiles
      : gridBounds.height >= totalSizeOfSidebarTiles;

    return isEnoughSpace;
  }, [gridBounds.height, gridBounds.width, isMobile, sidebarTiles]);

  // NOTE: this useEffect adjusts scroll position when sidebar tile disappears
  useEffect(() => {
    if (!sidebarTiles.length) return;

    const lastTile = sidebarTiles[sidebarTiles.length - 1];
    const maxScrollingDistance = isMobile
      ? gridBounds.width - lastTile.x - lastTile.width - GAP
      : gridBounds.height - lastTile.y - lastTile.height - GAP;

    // NOTE: no need to adjust scroll because user haven't scrolled or he haven't exceeded the max scrolling distance
    if (-scrollPosition <= 0 || -scrollPosition <= -maxScrollingDistance) return;

    // NOTE: adjust scroll position depending on if there is enough space to use scroll
    if (getIsEnoughSpaceForTiles()) setScrollPosition(0);
    else setScrollPosition(maxScrollingDistance);
  }, [getIsEnoughSpaceForTiles, gridBounds.height, gridBounds.width, isMobile, scrollPosition, sidebarTiles]);

  const bindGrid = useGesture({
    onWheel: (e) => onGridGesture(e, true),
    onDrag: (e) => onGridGesture(e, false),
  });

  return { bindTile, bindGrid, springs, scrollPosition, hiddenTiles };
};

export default useGestures;
