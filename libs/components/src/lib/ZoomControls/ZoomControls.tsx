import { ChangeEvent, MouseEventHandler } from 'react';

import ZoomButton from './ZoomButton';
import { ReactComponent as MinusMagnifier } from '../../assets/icons/MinusMagnifier.svg';
import { ReactComponent as PlusMagnifier } from '../../assets/icons/PlusMagnifier.svg';
import { ReactComponent as Reset } from '../../assets/icons/Reset.svg';
import Divider from '../Divider/Divider';

export type ButtonOnClick = MouseEventHandler<HTMLButtonElement>;

interface ZoomControlsProps {
  onZoomInClick: ButtonOnClick;
  onZoomOutClick: ButtonOnClick;
  onReset: ButtonOnClick;
  onSliderChange: (e: ChangeEvent<HTMLInputElement>) => void;
  scaleInPercent: number;
  isMinimalControls?: boolean;
}

const ZoomControls = ({
  onZoomInClick,
  onZoomOutClick,
  onReset,
  onSliderChange,
  scaleInPercent,
  isMinimalControls = false,
}: ZoomControlsProps) => (
  <div className="bg-black80 flex items-center space-x-1 rounded-2xl p-1">
    {scaleInPercent > 0 && !isMinimalControls && (
      <>
        <ZoomButton icon={Reset} onClick={onReset} />
        <Divider className="bg-white20 !h-6" isVertical />
      </>
    )}
    <ZoomButton icon={MinusMagnifier} onClick={onZoomOutClick} />
    {!isMinimalControls && (
      <input
        type="range"
        value={scaleInPercent}
        className="rounded-100 h-0.5 w-14 cursor-pointer bg-white"
        onChange={onSliderChange}
      />
    )}
    <ZoomButton icon={PlusMagnifier} onClick={onZoomInClick} />
  </div>
);

export default ZoomControls;
