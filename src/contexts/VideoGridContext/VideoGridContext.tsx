import { ResizeObserver } from '@juggle/resize-observer';
import { createContext, MutableRefObject, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import useMeasure, { RectReadOnly } from 'react-use-measure';

import { SetState } from 'utils/types';

import { TilePosition } from './getTilePositions/utils';
import useVideoGridLayout from './useVideoGridLayout';
import { Tile, LayoutType } from './utils';

export interface TilesState {
  tiles: Tile[];
  tilePositions: TilePosition[];
}

export type HiddenTiles = {
  startHiddenTiles: Tile[];
  endHiddenTiles: Tile[];
};

export interface VideoGridContextType {
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
  gridRef: (element: HTMLElement | null) => void;
  gridBounds: RectReadOnly;
  gridBoundsRef: MutableRefObject<RectReadOnly>;
  lastLayoutRef: MutableRefObject<LayoutType>;
  pipXRatio: number;
  setPipXRatio: SetState<number>;
  pipYRatio: number;
  setPipYRatio: SetState<number>;
  tiles: Tile[];
  tilePositions: TilePosition[];
  setTileState: SetState<TilesState>;
  hiddenTiles: HiddenTiles;
  setHiddenTiles: SetState<HiddenTiles>;
}

const VideoGridContext = createContext<VideoGridContextType | null>(null);

export const initialHiddenTiles = { startHiddenTiles: [], endHiddenTiles: [] };

const VideoGridProvider = ({ children }: PropsWithChildren) => {
  const { layout, setLayout } = useVideoGridLayout();
  const [gridRef, gridBounds] = useMeasure({ polyfill: ResizeObserver, debounce: 50 });
  const gridBoundsRef = useRef(gridBounds);
  const lastLayoutRef = useRef(layout);
  const [pipXRatio, setPipXRatio] = useState(1);
  const [pipYRatio, setPipYRatio] = useState(1);
  const [{ tiles, tilePositions }, setTileState] = useState<TilesState>({
    tiles: [],
    tilePositions: [],
  });
  const [hiddenTiles, setHiddenTiles] = useState<HiddenTiles>(initialHiddenTiles);

  // NOTE: needed for acquiring current value in setTimeout
  useEffect(() => {
    gridBoundsRef.current = gridBounds;
  }, [gridBounds]);

  return (
    <VideoGridContext.Provider
      value={{
        layout,
        setLayout,
        gridRef,
        gridBounds,
        gridBoundsRef,
        pipXRatio,
        lastLayoutRef,
        setPipXRatio,
        pipYRatio,
        setPipYRatio,
        tiles,
        tilePositions,
        setTileState,
        hiddenTiles,
        setHiddenTiles,
      }}
    >
      {children}
    </VideoGridContext.Provider>
  );
};

export function useVideoGridContext() {
  const context = useContext(VideoGridContext);
  if (!context) throw new Error('useVideoGridContext must be used within a VideoGridProvider');

  return context;
}

export default VideoGridProvider;
