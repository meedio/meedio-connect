import { TilePosition } from 'contexts/VideoGridContext/getTilePositions/utils';

type CursorPosition = { x: number; y: number };

export const isCursorInside = (
  { x, y }: CursorPosition,
  targetTile: TilePosition,
  scrollPosition: number,
  isMobile: boolean,
  isTargetFocused: boolean
) => {
  const defaultLeft = targetTile.x;
  const defaultTop = targetTile.y;
  const defaultRight = defaultLeft + targetTile.width;
  const defaultBottom = defaultTop + targetTile.height;

  const [left, top, bottom, right] = isMobile
    ? [defaultLeft + scrollPosition, defaultTop, defaultBottom, defaultRight + scrollPosition]
    : [defaultLeft, defaultTop + scrollPosition, defaultBottom + scrollPosition, defaultRight];

  if (!isTargetFocused && (x < left || x > right || y < top || y > bottom)) return false;
  if (isTargetFocused && (x < defaultLeft || x > defaultRight || y < defaultTop || y > defaultBottom)) return false;

  return true;
};
