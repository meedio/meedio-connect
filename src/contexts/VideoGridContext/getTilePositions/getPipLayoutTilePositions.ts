import { getFreedomLayoutTilePositions } from './getFreedomLayoutTilePositions/getFreedomLayoutTilePositions';
import { getPipGap } from '../utils';

interface PipLayoutProps {
  gridWidth: number;
  gridHeight: number;
  pipXRatio: number;
  pipYRatio: number;
}

export const getPipLayoutTilePositions = ({ gridWidth, gridHeight, pipXRatio, pipYRatio }: PipLayoutProps) => {
  const [remotePosition] = getFreedomLayoutTilePositions({
    tilesCount: 1,
    gridWidth,
    gridHeight,
    hasAspectRatio: false,
  });

  const gridAspectRatio = gridWidth / gridHeight;
  const smallPip = gridAspectRatio < 1 || gridWidth < 700;
  const pipWidth = smallPip ? 114 : 230;
  const pipHeight = smallPip ? 202 : 129;
  const pipGap = getPipGap(gridAspectRatio, gridWidth);

  const pipMinX = remotePosition.x + pipGap;
  const pipMinY = remotePosition.y + pipGap;
  const pipMaxX = remotePosition.x + remotePosition.width - pipWidth - pipGap;
  const pipMaxY = remotePosition.y + remotePosition.height - pipHeight - pipGap;

  return [
    {
      // Apply the PiP position as a proportion of the available space
      x: pipMinX + pipXRatio * (pipMaxX - pipMinX),
      y: pipMinY + pipYRatio * (pipMaxY - pipMinY),
      width: pipWidth,
      height: pipHeight,
      zIndex: 1,
    },
    remotePosition,
  ];
};
