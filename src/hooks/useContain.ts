import { Key, useCallback, useEffect } from 'react';

import { TileDescriptor, TileTypeEnum } from 'contexts/VideoGridContext/utils';
import { useVideoGridContext } from 'contexts/VideoGridContext/VideoGridContext';

export type ToggleIsContain = (isContain?: boolean) => void;

const useContain = (id: Key, item: TileDescriptor) => {
  const { setTileState, tiles } = useVideoGridContext();

  const tile = tiles.find((tile) => tile.key === id);
  const isScreenSharingParticipant = (item.type === TileTypeEnum.PARTICIPANT && item.isScreenSharing) || false;
  const isContain = !!tile?.isContain;

  const toggleIsContain = useCallback(
    (isContain?: boolean) =>
      setTileState(({ tiles, ...rest }) => {
        const updatedTiles = tiles.map((tile) => {
          if (tile.key !== id || !tile.focused) return tile;
          const updatedTile = {
            ...tile,
            isContain: isContain !== undefined ? isContain : !tile.isContain,
          };

          return updatedTile;
        });

        return { ...rest, tiles: updatedTiles };
      }),
    [id, setTileState]
  );

  useEffect(() => {
    if (isScreenSharingParticipant) return toggleIsContain(true);
    if (!tile?.focused) return toggleIsContain(false);
  }, [isScreenSharingParticipant, tile?.focused, toggleIsContain]);

  return { isContain, toggleIsContain };
};

export default useContain;
