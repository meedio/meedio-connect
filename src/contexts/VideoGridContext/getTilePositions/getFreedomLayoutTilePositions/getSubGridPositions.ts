import { GAP } from '../utils';

interface getSubGridPositionsProps {
  tilesCount: number;
  columnCount: number;
  rowCount: number;
  tileAspectRatio: number;
  gridWidth: number;
  gridHeight: number;
}

export const getSubGridPositions = ({
  tilesCount,
  columnCount,
  rowCount,
  tileAspectRatio,
  gridWidth,
  gridHeight,
}: getSubGridPositionsProps) => {
  const boxWidth = Math.round((gridWidth - GAP * (columnCount + 1)) / columnCount);
  const boxHeight = Math.round((gridHeight - GAP * (rowCount - 1)) / rowCount);
  const boxAspectRatio = boxWidth / boxHeight;

  const [tileW, tileH] =
    boxAspectRatio > tileAspectRatio
      ? [boxHeight * tileAspectRatio, boxHeight]
      : [boxWidth, boxWidth / tileAspectRatio];

  const [tileWidth, tileHeight] = tileAspectRatio ? [tileW, tileH] : [boxWidth, boxHeight];

  return Array.from(Array(tilesCount)).map((_, index) => {
    const verticalIndex = Math.floor(index / columnCount);
    const top = verticalIndex * GAP + verticalIndex * tileHeight;
    const rowItemCount =
      verticalIndex + 1 === rowCount && tilesCount % columnCount !== 0 ? tilesCount % columnCount : columnCount;

    const horizontalIndex = index % columnCount;
    const subGridWidth = tileWidth * columnCount + (GAP * columnCount - 1);
    const centeringPadding =
      rowItemCount > columnCount
        ? 0
        : Math.round((subGridWidth - (tileWidth * rowItemCount + (GAP * rowItemCount - 1))) / 2);

    const left = centeringPadding + GAP * horizontalIndex + tileWidth * horizontalIndex;

    return {
      width: tileWidth,
      height: tileHeight,
      x: left,
      y: top,
      zIndex: 0,
    };
  });
};
