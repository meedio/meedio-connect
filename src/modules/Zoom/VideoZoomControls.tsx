import Button from '@shared/components/Button/Button';
import ZoomControls from '@shared/components/ZoomControls/ZoomControls';
import { ComponentPropsWithoutRef } from 'react';
import { RectReadOnly } from 'react-use-measure';

import { ReactComponent as Contain } from 'assets/icons/Contain.svg';
import { ReactComponent as Cover } from 'assets/icons/Cover.svg';
import constants from 'Constants';
import { ZoomState } from 'contexts/VideoGridContext/utils';
import { ToggleIsContain } from 'hooks/useContain';
import { SetState } from 'utils/types';

import useZoom from './useZoom';
import ZoomControlsGroup from './ZoomControlsGroup';

export interface VideoZoomControlsProps {
  toggleIsContain: ToggleIsContain;
  isContain: boolean;
  id: string;
  canShowVideoModeChangeBtn: boolean;
  zoomState: ZoomState;
  setZoomState: SetState<ZoomState>;
  dimensions: RectReadOnly;
  isMinimalControls: boolean;
}

const VideoZoomControls = ({
  toggleIsContain,
  isContain,
  canShowVideoModeChangeBtn,
  zoomState,
  setZoomState,
  dimensions,
  id,
  isMinimalControls,
  ...rest
}: Omit<ComponentPropsWithoutRef<'div'>, 'id'> & VideoZoomControlsProps) => {
  const { scaleInPercent, handleResetTransform, handleZoomIn, handleZoomOut, handleSliderChange } = useZoom({
    id,
    zoomState,
    setZoomState,
    dimensions,
  });

  const VideoModeIcon = isContain ? Cover : Contain;

  const handleToggleContain = () => toggleIsContain();

  return (
    <div
      className="absolute right-0 top-0 z-20 m-2 hidden cursor-auto space-x-1 group-hover:flex"
      id={constants.ZOOM_CONTROLS_ID}
      {...rest}
    >
      <ZoomControls
        onZoomInClick={handleZoomIn}
        onZoomOutClick={handleZoomOut}
        onReset={handleResetTransform}
        onSliderChange={handleSliderChange}
        scaleInPercent={scaleInPercent}
        isMinimalControls={isMinimalControls}
      />
      {canShowVideoModeChangeBtn && (
        <ZoomControlsGroup>
          <Button variant="recordingDefault" size="neutral" className="rounded-xl p-1.5" onClick={handleToggleContain}>
            <VideoModeIcon className="h-5 w-5 stroke-white" />
          </Button>
        </ZoomControlsGroup>
      )}
    </div>
  );
};

export default VideoZoomControls;
