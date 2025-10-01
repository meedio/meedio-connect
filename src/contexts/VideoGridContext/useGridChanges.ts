// import { useSyncScreenContext } from 'contexts/SyncScreenContext';
import { Key, useEffect, useMemo } from 'react';

import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import useIsMounted from 'hooks/useIsMounted';
import { getIsMobile } from 'utils/browsers';
import { initialZoomState } from 'utils/Constants';

import { getTilePositions } from './getTilePositions/getTilePositions';
import { countWithProperty, WAITING_PLACEHOLDER } from './layoutUtils';
import { reorderTiles } from './reorderTiles';
import { LayoutType, Tile, TileDescriptor, TileTypeEnum } from './utils';
import { useVideoGridContext } from './VideoGridContext';

const TILE_SHADOW_SIZE = 2;

const useGridChanges = (items: TileDescriptor[]) => {
  const isMounted = useIsMounted();
  const { setTileState, setLayout, pipXRatio, pipYRatio, gridBounds, gridBoundsRef, layout, lastLayoutRef, tiles } =
    useVideoGridContext();
  // const { syncScreenStatus } = useSyncScreenContext();
  const {
    state: { isSpotlightSidebarVisible, isScreenTilesVisible, isLocalViewFloating },
  } = useRoomUIContext();
  const focusedTilesCount = useMemo(() => countWithProperty(tiles, 'focused'), [tiles]);
  // const isScreenSyncOn = syncScreenStatus === SyncScreenStatusEnum.SYNCING;

  //NOTE: needed for when you start screen sharing only (maybe could set the layout in screen sharing logic)
  useEffect(() => {
    if (focusedTilesCount && !isLocalViewFloating) return setLayout(LayoutType.SPOTLIGHT);

    setLayout(LayoutType.FREEDOM);
  }, [focusedTilesCount, isLocalViewFloating, items, setLayout, tiles]);

  useEffect(() => {
    setTileState(({ tiles, ...rest }) => {
      const newTiles: Tile[] = [];
      const removedTileKeys: Set<Key> = new Set();
      const isTherePlaceholder = items.some(({ id }) => id === WAITING_PLACEHOLDER);
      tiles.forEach((tile) => {
        const originalItem = items.find(({ id }) => id === tile.key);
        const item = originalItem || tile.item;

        // NOTE: placeholder will be replaced with a remote participant feed, there is no need to remove it
        if (!originalItem && tile.key !== WAITING_PLACEHOLDER) removedTileKeys.add(tile.key);

        const shouldBeReplaced = tile.item.replace || (!originalItem && isTherePlaceholder);
        const tilesCount = tiles.length;
        const isSpotlight = layout === LayoutType.SPOTLIGHT;
        const isOneOnOne = tilesCount === 2;

        const isItemScreenSharing = item.type === TileTypeEnum.PARTICIPANT && item.isScreenSharing;
        const isTileScreenSharing = tile.item.type === TileTypeEnum.PARTICIPANT && tile.item.isScreenSharing;
        const isStartingToScreenShare = isItemScreenSharing && !isTileScreenSharing;
        const isStoppingScreenShare = !isItemScreenSharing && isTileScreenSharing && tile.focused;

        const shouldFocusMobilePreviewTile = item.type === TileTypeEnum.VIDEO_PREVIEW && getIsMobile();
        const shouldFocusInOneOnOne = !focusedTilesCount && isStartingToScreenShare;
        const shouldFocusInSpotlight = isSpotlight && isStartingToScreenShare;
        const shouldFocusInFreedom = !isSpotlight && isStartingToScreenShare;
        const shouldAutoFocus = isOneOnOne ? shouldFocusInOneOnOne : shouldFocusInSpotlight || shouldFocusInFreedom;
        const shouldBeFocused =
          isStoppingScreenShare || tile.focused || shouldAutoFocus || shouldFocusMobilePreviewTile;
        if (isItemScreenSharing && item.id.includes('local') && !isScreenTilesVisible) return;

        newTiles.push({
          key: item.id,
          order: tile.order,
          item: { ...item, replace: shouldBeReplaced },
          remove: !originalItem,
          //NOTE: if isScreenSyncOn we want to ignore auto focusing of shared screen and use tile.focused
          focused: shouldBeFocused,
          zoomState: tile.zoomState,
          draggable: tile.zoomState.tileScale === 1,
          isContain: tile.isContain,
        });
      });

      items.forEach((item) => {
        const hasTileAlready = newTiles.some(({ key }) => item.id === key);
        if (hasTileAlready) return;

        // NOTE: Replaceable tile can be a placeholder or the last remote participant that is leaving
        const replaceableTileIndex = newTiles.findIndex(({ item: { replace } }) => replace);
        const replaceableTile: Tile | undefined = newTiles[replaceableTileIndex];

        const isLocalParticipant = item.id.includes('local');
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
          focused: isScreenShareItem || false,
          zoomState: initialZoomState,
          isContain: true,
        };

        if (shouldReplaceTile) return newTiles.splice(replaceableTileIndex, 1, newTile);
        if (isScreenShareItem && isLocalParticipant && !isScreenTilesVisible) return;

        return newTiles.push(newTile);
      });

      reorderTiles(newTiles, isLocalViewFloating);

      if (removedTileKeys.size > 0) {
        setTimeout(() => {
          if (!isMounted()) return;

          setTileState(({ tiles, ...rest }) => {
            const newTiles = tiles.filter((tile) => !removedTileKeys.has(tile.key)).map((tile) => ({ ...tile })); // clone before reordering
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
    gridBounds,
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

export default useGridChanges;
