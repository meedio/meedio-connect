import { Key, useEffect, useMemo } from 'react';

import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { getTilePositions } from 'contexts/VideoGridContext/getTilePositions/getTilePositions';
import { countWithProperty, WAITING_PLACEHOLDER } from 'contexts/VideoGridContext/layoutUtils';
import { reorderTiles } from 'contexts/VideoGridContext/reorderTiles';
import { TileDescriptor, LayoutType, Tile, TileTypeEnum } from 'contexts/VideoGridContext/utils';
import { useVideoGridContext } from 'contexts/VideoGridContext/VideoGridContext';
import useIsMounted from 'hooks/useIsMounted';
import { getIsMobile } from 'utils/browsers';
import { initialZoomState } from 'utils/Constants';

const TILE_SHADOW_SIZE = 2;

const useLivekitVideoChanges = (items: TileDescriptor[]) => {
  const isMounted = useIsMounted();
  const { setTileState, setLayout, pipXRatio, pipYRatio, gridBounds, gridBoundsRef, layout, lastLayoutRef, tiles } =
    useVideoGridContext();
  const {
    state: { isSpotlightSidebarVisible, isScreenTilesVisible, isLocalViewFloating },
  } = useRoomUIContext();
  const focusedTilesCount = useMemo(() => countWithProperty(tiles, 'focused'), [tiles]);

  //NOTE: needed for when you start screen sharing only (maybe could set the layout in screen sharing logic)
  useEffect(() => {
    if (focusedTilesCount && !isLocalViewFloating) return setLayout(LayoutType.SPOTLIGHT);

    setLayout(LayoutType.FREEDOM);
  }, [focusedTilesCount, isLocalViewFloating, items, setLayout, tiles]);

  useEffect(() => {
    setTileState(({ tiles, ...rest }) => {
      const newTiles: Tile[] = [];
      const removedTileKeys = new Set<Key>();
      const isTherePlaceholder = items.some(({ id }) => id === WAITING_PLACEHOLDER);

      tiles.forEach(({ key, item: tileItem, focused, zoomState, order, isContain }) => {
        const originalItem = items.find(({ id }) => id === key);
        const item = originalItem || tileItem;

        // NOTE: placeholder will be replaced with a remote participant feed, there is no need to remove it
        if (!originalItem && key !== WAITING_PLACEHOLDER) removedTileKeys.add(key);

        const shouldBeReplaced = item.replace || (!originalItem && isTherePlaceholder);
        const tilesCount = tiles.length;
        const isSpotlight = layout === LayoutType.SPOTLIGHT;
        const isOneOnOne = tilesCount === 2;

        const isItemScreenSharing = item.type === TileTypeEnum.PARTICIPANT && item.isScreenSharing;
        const isTileScreenSharing = item.type === TileTypeEnum.PARTICIPANT && item.isScreenSharing;
        if (isItemScreenSharing && item.isLocal && !isScreenTilesVisible) return;

        const isStartingToScreenShare = isItemScreenSharing && !isTileScreenSharing;
        const isStoppingScreenShare = !isItemScreenSharing && isTileScreenSharing && focused;

        const shouldFocusMobilePreviewTile = item.type === TileTypeEnum.VIDEO_PREVIEW && getIsMobile();
        const shouldFocusInOneOnOne = !focusedTilesCount && isStartingToScreenShare;
        const shouldFocusInSpotlight = isSpotlight && isStartingToScreenShare;
        const shouldFocusInFreedom = !isSpotlight && isStartingToScreenShare;
        const shouldAutoFocus = isOneOnOne ? shouldFocusInOneOnOne : shouldFocusInSpotlight || shouldFocusInFreedom;
        const shouldBeFocused = isStoppingScreenShare || focused || shouldAutoFocus || shouldFocusMobilePreviewTile;

        newTiles.push({
          key: item.id,
          order,
          item: { ...item, replace: shouldBeReplaced },
          remove: !originalItem,
          //NOTE: if isScreenSyncOn we want to ignore auto focusing of shared screen and use focused
          focused: shouldBeFocused || false,
          zoomState,
          draggable: zoomState.tileScale === 1,
          isContain,
        });
      });

      items.forEach((item) => {
        const hasTileAlready = newTiles.some(({ key }) => item.id === key);
        if (hasTileAlready) return;

        // NOTE: Replaceable tile can be a placeholder or the last remote participant that is leaving
        const replaceableTileIndex = newTiles.findIndex(({ item: { replace } }) => replace);
        const replaceableTile: Tile | undefined = newTiles[replaceableTileIndex];

        const isScreenShareItem = item.type === TileTypeEnum.PARTICIPANT && item.isScreenSharing;

        // NOTE: we want to keep placeholder if user starts to screen share
        const shouldReplaceTile = replaceableTile && !isScreenShareItem;
        const newTileOrder = shouldReplaceTile ? replaceableTile.order : newTiles.length;

        const newTile: Tile = {
          key: item.id,
          order: newTileOrder,
          item,
          draggable: true,
          remove: false,
          focused: !!isScreenShareItem,
          zoomState: initialZoomState,
          isContain: true,
        };

        if (shouldReplaceTile) return newTiles.splice(replaceableTileIndex, 1, newTile);
        if (isScreenShareItem && item.isLocal && !isScreenTilesVisible) return;

        return newTiles.push(newTile);
      });

      reorderTiles(newTiles, isLocalViewFloating);

      if (removedTileKeys.size > 0) {
        setTimeout(() => {
          if (!isMounted()) return;

          setTileState(({ tiles, ...rest }) => {
            const newTiles = tiles.filter(({ key }) => !removedTileKeys.has(key)).map((tile) => ({ ...tile })); // clone before reordering
            const tilesInFocusCount = countWithProperty(newTiles, 'focused');

            reorderTiles(newTiles, isLocalViewFloating);

            return {
              ...rest,
              tiles: newTiles,
              tilePositions: getTilePositions({
                tilesCount: newTiles.length,
                tilesInSpotlightCount: tilesInFocusCount,
                gridWidth: gridBoundsRef.current.width - TILE_SHADOW_SIZE,
                gridHeight: gridBoundsRef.current.height - TILE_SHADOW_SIZE,
                pipXRatio,
                pipYRatio,
                layout: (tilesInFocusCount && LayoutType.SPOTLIGHT) || LayoutType.FREEDOM,
                isLocalViewFloating,
                isSpotlightSidebarVisible,
              }),
            };
          });
        }, 250);
      }

      const focusedNewTilesCount = countWithProperty(newTiles, 'focused');
      lastLayoutRef.current = layout;

      return {
        ...rest,
        tiles: newTiles,
        tilePositions: getTilePositions({
          tilesCount: newTiles.length,
          tilesInSpotlightCount: focusedNewTilesCount,
          gridWidth: gridBounds.width,
          gridHeight: gridBounds.height - TILE_SHADOW_SIZE,
          pipXRatio,
          pipYRatio,
          layout: focusedNewTilesCount ? LayoutType.SPOTLIGHT : LayoutType.FREEDOM,
          isLocalViewFloating,
          isSpotlightSidebarVisible,
        }),
      };
    });
  }, [
    focusedTilesCount,
    gridBounds.height,
    gridBounds.width,
    gridBoundsRef,
    isLocalViewFloating,
    isMounted,
    isScreenTilesVisible,
    isSpotlightSidebarVisible,
    items,
    lastLayoutRef,
    layout,
    pipXRatio,
    pipYRatio,
    setTileState,
  ]);
};

export default useLivekitVideoChanges;
