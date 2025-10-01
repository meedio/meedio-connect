import { ChangeEvent, useCallback, useEffect } from 'react';
import { RectReadOnly } from 'react-use-measure';
import { useControls, useTransformEffect } from 'react-zoom-pan-pinch';
import { useDebounce } from 'rooks';

import { initialZoomState } from 'Constants';
import { ZoomState } from 'contexts/VideoGridContext/utils';
import { useVideoGridContext } from 'contexts/VideoGridContext/VideoGridContext';
import { SetState } from 'utils/types';

type UseZoomProps = {
  id: string;
  zoomState: ZoomState;
  setZoomState: SetState<ZoomState>;
  dimensions: RectReadOnly;
};

const useZoom = ({ setZoomState, zoomState, id, dimensions: { width, height } }: UseZoomProps) => {
  const { setTileState } = useVideoGridContext();
  const { zoomIn, resetTransform, centerView, setTransform } = useControls();

  const scaleInPercent = ((zoomState.tileScale - 1) / 3) * 100;

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) =>
    centerView(Number(((Number(e.target.value) * 3) / 100 + 1).toFixed(2)), 0);

  const handleZoomIn = () => zoomIn(0.75);
  const handleZoomOut = () => zoomIn(-0.75);
  const handleResetTransform = () => resetTransform();

  const updateTileZoomState = useCallback(() => {
    setTileState(({ tiles, ...rest }) => {
      const updatedTiles = tiles.map((tile) => {
        const { key, focused } = tile;
        if (key !== id || !focused) return tile;

        const { tileScale } = zoomState;
        const updatedTile = {
          ...tile,
          draggable: tileScale === 1,
          zoomState,
        };

        return updatedTile;
      });

      return { ...rest, tiles: updatedTiles };
    });
  }, [id, setTileState, zoomState]);

  const debouncedUpdateTileZoomState = useDebounce(() => updateTileZoomState(), 100);

  useTransformEffect(({ state: { scale, positionX, positionY } }) => {
    setZoomState({ tileScale: scale, percentX: positionX / width, percentY: positionY / height });
    debouncedUpdateTileZoomState();
  });

  useEffect(
    () => () => {
      resetTransform(0);
      setZoomState(initialZoomState);
      setTransform(0, 0, 1);
      setTileState(({ tiles, ...rest }) => {
        const updatedTiles = tiles.map((tile) => {
          if (tile.key !== id) return tile;

          return { ...tile, draggable: true, zoomState: initialZoomState };
        });

        return { ...rest, tiles: updatedTiles };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { scaleInPercent, handleResetTransform, handleZoomIn, handleZoomOut, handleSliderChange };
};

export default useZoom;
