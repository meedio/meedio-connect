import { getFreedomLayoutTilePositions } from './getFreedomLayoutTilePositions/getFreedomLayoutTilePositions';
import { getPipLayoutTilePositions } from './getPipLayoutTilePositions';
import { getSpotlightLayoutTilePositions, SpotlightLayoutProps } from './getSpotlightLayoutTilePositions';
import { LayoutType } from '../utils';

interface GetTilePositionsProps extends SpotlightLayoutProps {
  pipXRatio: number;
  pipYRatio: number;
  layout: LayoutType;
  isLocalViewFloating: boolean;
  isSpotlightSidebarVisible: boolean;
}

export const getTilePositions = ({
  tilesCount,
  tilesInSpotlightCount,
  gridWidth,
  gridHeight,
  pipXRatio,
  pipYRatio,
  layout,
  isLocalViewFloating,
  isSpotlightSidebarVisible = true,
}: GetTilePositionsProps) => {
  const isFloatingOneOnOne = tilesCount === 2 && isLocalViewFloating;
  const isFreedom = layout === LayoutType.FREEDOM;

  if (isFloatingOneOnOne) return getPipLayoutTilePositions({ gridWidth, gridHeight, pipXRatio, pipYRatio });
  if (isFreedom) return getFreedomLayoutTilePositions({ tilesCount, gridWidth, gridHeight });

  return getSpotlightLayoutTilePositions({
    tilesCount,
    tilesInSpotlightCount,
    gridWidth,
    gridHeight,
    isSpotlightSidebarVisible,
  });
};
