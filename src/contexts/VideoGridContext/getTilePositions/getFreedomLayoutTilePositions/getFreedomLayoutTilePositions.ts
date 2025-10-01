import { getSubGridBoundingBox } from './getSubGridBoundingBox';
import { getSubGridLayout } from './getSubGridLayout';
import { getSubGridPositions } from './getSubGridPositions';

export interface FreedomLayoutProps {
  tilesCount: number;
  gridWidth: number;
  gridHeight: number;
  hasAspectRatio?: boolean;
}

export const getFreedomLayoutTilePositions = ({
  tilesCount,
  gridWidth,
  gridHeight,
  hasAspectRatio = true,
}: FreedomLayoutProps) => {
  const { columnCount, rowCount, tileAspectRatio } = getSubGridLayout(
    tilesCount,
    gridWidth,
    gridHeight,
    hasAspectRatio
  );
  const itemGridPositions = getSubGridPositions({
    tilesCount,
    columnCount,
    rowCount,
    tileAspectRatio,
    gridWidth,
    gridHeight,
  });

  // Center tiles
  const bounds = getSubGridBoundingBox(itemGridPositions);

  const leftOffset = Math.round((gridWidth - bounds.width) / 2);
  const topOffset = Math.round((gridHeight - bounds.height) / 2);

  itemGridPositions.forEach((position) => {
    position.x += leftOffset;
    position.y += topOffset;
  });

  return itemGridPositions;
};
