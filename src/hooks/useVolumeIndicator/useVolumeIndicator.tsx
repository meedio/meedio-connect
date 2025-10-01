import { useEffect, useRef } from 'react';

import useInitializeAnalyser from './useInitializeAnalyzer';
import { keepUpdatingValues } from './utils';

const useVolumeIndicator = (
  isMicOn: boolean,
  colors: [string, string],
  mediaStream?: MediaStream,
  audioInputId?: string
) => {
  const audioLevelRef = useRef<HTMLDivElement>(null);
  const newVolumeLevel = useRef(0);
  const newPeakVolumeLevel = useRef(0);
  const audioLevelElement = audioLevelRef.current;
  const analyser = useInitializeAnalyser(mediaStream);

  useEffect(() => {
    newPeakVolumeLevel.current = 0;
  }, [mediaStream, audioInputId]);

  useEffect(() => {
    if (audioLevelElement && analyser) {
      const { stopIntervals, timerId } = keepUpdatingValues(
        analyser,
        newPeakVolumeLevel,
        newVolumeLevel,
        audioLevelElement,
        colors,
        isMicOn
      );

      return () => {
        stopIntervals();
        clearInterval(timerId);
      };
    }
  }, [analyser, audioLevelElement, colors, isMicOn]);

  return audioLevelRef;
};

export default useVolumeIndicator;
