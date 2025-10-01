import { ResizeObserver } from '@juggle/resize-observer';
import { PropsWithChildren, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { initialZoomState } from 'Constants';
import { ZoomState } from 'contexts/VideoGridContext/utils';

import VideoZoomControls, { VideoZoomControlsProps } from './VideoZoomControls';

interface VideoZoomWrapperProps extends Omit<VideoZoomControlsProps, 'zoomState' | 'setZoomState' | 'dimensions'> {
  onControlsMouseEnter?: () => void;
  onControlsMouseLeave?: () => void;
  isDisabled: boolean;
  id: string;
  isMinimalControls: boolean;
}

const VideoZoomWrapper = ({
  children,
  onControlsMouseEnter,
  onControlsMouseLeave,
  isDisabled,
  id,
  toggleIsContain,
  isContain,
  canShowVideoModeChangeBtn,
  isMinimalControls,
}: PropsWithChildren<VideoZoomWrapperProps>) => {
  const [zoomState, setZoomState] = useState<ZoomState>(initialZoomState);
  const [tileRef, dimensions] = useMeasure({ polyfill: ResizeObserver, debounce: 200 });
  const ref = useRef<HTMLDivElement | null>(null);

  const changeCursor = (style: string) => {
    if (ref.current) return (ref.current.style.cursor = style);
  };

  const handlePanningStart = () => changeCursor('grab');
  const handlePanningStop = () => changeCursor('pointer');

  return (
    <div ref={tileRef} className="h-full w-full">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        wheel={{ step: 0.2 }}
        panning={{ disabled: zoomState.tileScale === 1, velocityDisabled: true }}
        zoomAnimation={{ disabled: true }}
        velocityAnimation={{ disabled: true }}
        doubleClick={{ disabled: true }}
        alignmentAnimation={{ animationTime: 0, velocityAlignmentTime: 0 }}
        disabled={isDisabled}
        onPanningStart={handlePanningStart}
        onPanningStop={handlePanningStop}
      >
        {!isDisabled && (
          <VideoZoomControls
            id={id}
            onMouseEnter={onControlsMouseEnter}
            onMouseLeave={onControlsMouseLeave}
            setZoomState={setZoomState}
            zoomState={zoomState}
            toggleIsContain={toggleIsContain}
            isContain={isContain}
            canShowVideoModeChangeBtn={canShowVideoModeChangeBtn}
            dimensions={dimensions}
            isMinimalControls={isMinimalControls}
          />
        )}
        <TransformComponent contentClass="!w-full !h-full" wrapperClass="z-10 !w-full !h-full">
          <div ref={ref} className="h-full w-full">
            {children}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default VideoZoomWrapper;
