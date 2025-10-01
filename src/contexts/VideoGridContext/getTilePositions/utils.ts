export const GAP = 8;
export const isMobileBreakpoint = (gridWidth: number, gridHeight: number) => gridWidth / gridHeight < 1;

export type LayoutDirection = 'vertical' | 'horizontal';

export interface TilePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}
