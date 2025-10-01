import { ConnectionQuality } from 'livekit-client';

import { ReactComponent as SignalCellular0Bar } from 'assets/icons/SignalCellular0Bar.svg';
import { ReactComponent as SignalCellular1Bar } from 'assets/icons/SignalCellular1Bar.svg';
import { ReactComponent as SignalCellular2Bar } from 'assets/icons/SignalCellular2Bar.svg';
import { ReactComponent as SignalCellular3Bar } from 'assets/icons/SignalCellular3Bar.svg';
import { IconType } from 'utils/types';

export const getNetworkIndicatorIcon = (quality: ConnectionQuality): IconType => {
  switch (quality) {
    case ConnectionQuality.Lost:
      return SignalCellular0Bar;
    case ConnectionQuality.Poor:
      return SignalCellular1Bar;
    case ConnectionQuality.Good:
      return SignalCellular2Bar;
    case ConnectionQuality.Excellent:
      return SignalCellular3Bar;
    default:
      return SignalCellular0Bar;
  }
};

export const capitalizeFirstLetter = (sentence: string) =>
  sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
