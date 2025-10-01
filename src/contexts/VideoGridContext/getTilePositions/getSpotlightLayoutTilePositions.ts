import {
  FreedomLayoutProps,
  getFreedomLayoutTilePositions,
} from './getFreedomLayoutTilePositions/getFreedomLayoutTilePositions';
import { GAP } from './utils';

export interface SpotlightLayoutProps extends FreedomLayoutProps {
  tilesInSpotlightCount: number;
  isSpotlightSidebarVisible: boolean;
}

export const getSpotlightLayoutTilePositions = ({
  tilesCount,
  tilesInSpotlightCount,
  gridWidth,
  gridHeight,
  isSpotlightSidebarVisible,
}: SpotlightLayoutProps) => {
  const gridAspectRatio = gridWidth / gridHeight;
  const isMobile = gridAspectRatio < 1;

  const areAllTilesSpotlighted = tilesCount - tilesInSpotlightCount === 0;
  const isFullSize = !isSpotlightSidebarVisible || areAllTilesSpotlighted;

  const spotlightTileHeightArea = isFullSize ? gridHeight : gridHeight * (4 / 5);
  const mobileSpotlightTileHeight =
    tilesInSpotlightCount < 2 ? spotlightTileHeightArea : (spotlightTileHeightArea - GAP) / 2;
  const desktopSpotlightTileHeight = gridHeight;
  const spotlightTileHeight = (isMobile && mobileSpotlightTileHeight) || desktopSpotlightTileHeight;

  const spotlightTileWidthArea = isFullSize ? gridWidth : gridWidth / 1.1625;
  const mobileSpotlightTileWidth = gridWidth - GAP * 2;
  const desktopSpotlightTileWidth =
    tilesInSpotlightCount < 2 ? spotlightTileWidthArea : (spotlightTileWidthArea - GAP) / 2;
  const spotlightTileWidth = (isMobile && mobileSpotlightTileWidth) || desktopSpotlightTileWidth;

  const spectatorTileSize = isSpotlightSidebarVisible ? gridHeight - GAP - spotlightTileHeightArea : 1;
  const mobileSpectatorTileSize = isMobile && spectatorTileSize;

  const spectatorTileWidth = isSpotlightSidebarVisible ? gridWidth - GAP - spotlightTileWidthArea : 1;
  const spectatorTileHeight = spectatorTileWidth * (9 / 16);

  const itemGridPositions = getFreedomLayoutTilePositions({
    tilesCount: tilesInSpotlightCount,
    gridHeight: isFullSize ? gridHeight : isMobile ? gridHeight - spectatorTileSize - GAP : gridHeight,
    gridWidth: isFullSize ? gridWidth : isMobile ? gridWidth : gridWidth - spectatorTileWidth - GAP,
  });

  if (!areAllTilesSpotlighted) {
    Array.from({ length: tilesCount - tilesInSpotlightCount }).forEach((_, index) => {
      const mobileSpectatorX = isMobile && (GAP + spectatorTileSize) * index + GAP;
      const desktopSpectatorX = GAP + spotlightTileWidthArea;
      const mobileSpectatorY = isMobile && spotlightTileHeightArea + GAP;
      const desktopSpectatorY = spectatorTileHeight * index + GAP * index;

      itemGridPositions.push({
        x: mobileSpectatorX || desktopSpectatorX,
        y: mobileSpectatorY || desktopSpectatorY,
        width: mobileSpectatorTileSize || spectatorTileWidth,
        height: mobileSpectatorTileSize || spectatorTileHeight,
        zIndex: 0,
      });
    });
  }

  if (tilesInSpotlightCount > 2) return itemGridPositions;

  return Array.from(Array(tilesCount)).map((_, index) => {
    const mobileSpectatorX = isMobile && (GAP + spectatorTileSize) * (index - tilesInSpotlightCount) + GAP;
    const desktopSpectatorX = GAP + spotlightTileWidthArea;
    const mobileSpectatorY = isMobile && spotlightTileHeightArea + GAP;
    const desktopSpectatorY = (GAP + spectatorTileHeight) * (index - tilesInSpotlightCount);

    if (index === 0 || (index === 1 && tilesInSpotlightCount === 2)) {
      return {
        x: !isMobile ? (spotlightTileWidth + GAP) * index : GAP,
        y: isMobile ? (spotlightTileHeight + GAP) * index : 0,
        width: spotlightTileWidth,
        height: spotlightTileHeight,
        zIndex: 0,
      };
    }

    return {
      x: mobileSpectatorX || desktopSpectatorX,
      y: mobileSpectatorY || desktopSpectatorY,
      width: mobileSpectatorTileSize || spectatorTileWidth,
      height: mobileSpectatorTileSize || spectatorTileHeight,
      zIndex: 0,
    };
  });
};
