import { TilePosition } from '../utils';

export const getSubGridBoundingBox = (positions: TilePosition[]) => {
  const gridBoundingBox = positions.reduce(
    ({ left, right, top, bottom }, { height, width, x, y }, index) => {
      if (index === 0) return { left: x, right: x + width, top: y, bottom: y + height };

      return {
        left: (x < left && x) || left,
        right: (x + width > right && x + width) || right,
        top: (y < top && y) || top,
        bottom: (y + height > bottom && y + height) || bottom,
      };
    },
    { left: 0, right: 0, top: 0, bottom: 0 }
  );

  return {
    ...gridBoundingBox,
    width: gridBoundingBox.right - gridBoundingBox.left,
    height: gridBoundingBox.bottom - gridBoundingBox.top,
  };
};
