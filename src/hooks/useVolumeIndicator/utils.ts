import { MutableRefObject } from 'react';

import { Interval, Timeout } from 'utils/types';

export function initializeAnalyser(stream: MediaStream, smoothingTimeConstant = 0.4) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const audioSource = audioContext.createMediaStreamSource(stream);

  const analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = smoothingTimeConstant;
  analyser.fftSize = 512;

  audioSource.connect(analyser);
  return analyser;
}

export const getPeakVolumeFunctions = (newPeakVolumeLevel: MutableRefObject<number>) => {
  let resetPeakVolume: Interval;
  let intervalTimeout: Timeout;

  const startPeakVolumeInterval = () => (resetPeakVolume = setInterval(() => (newPeakVolumeLevel.current -= 7), 30));

  const startPeakVolumeTimeout = () => (intervalTimeout = setTimeout(startPeakVolumeInterval, 500));

  const stopIntervals = () => {
    clearInterval(resetPeakVolume);
    clearTimeout(intervalTimeout);
  };

  return { stopIntervals, startPeakVolumeTimeout };
};

export const calculateVolumeLevel = (length: number, spectrumArray: Uint8Array) => {
  const squaresSum = spectrumArray.reduce((prev, next) => prev + next * next, 0);
  return Math.sqrt(squaresSum / length);
};

const resetValues = (
  timer: Timeout,
  stopIntervals: () => void,
  newPeakVolumeLevel: MutableRefObject<number>,
  newVolumeLevel: MutableRefObject<number>
) => {
  newPeakVolumeLevel.current = 0;
  newVolumeLevel.current = 0;
  clearInterval(timer);
  stopIntervals();
};

const updateValues = (
  stopIntervals: () => void,
  startPeakVolumeTimeout: () => Timeout,
  newPeakVolumeLevel: MutableRefObject<number>,
  newVolumeLevel: MutableRefObject<number>
) => {
  stopIntervals();
  newPeakVolumeLevel.current = newVolumeLevel.current;
  startPeakVolumeTimeout();
};

export const keepUpdatingValues = (
  analyser: AnalyserNode,
  newPeakVolumeLevel: MutableRefObject<number>,
  newVolumeLevel: MutableRefObject<number>,
  audioLevelElement: HTMLDivElement,
  [colorVolume, colorPeakVolume]: [string, string],
  isMicOn: boolean
) => {
  const spectrumArray = new Uint8Array(analyser.frequencyBinCount);
  const { length } = spectrumArray;
  const { stopIntervals, startPeakVolumeTimeout } = getPeakVolumeFunctions(newPeakVolumeLevel);

  const timerId = setInterval(() => {
    analyser.getByteFrequencyData(spectrumArray);

    newVolumeLevel.current = calculateVolumeLevel(length, spectrumArray);

    if (newVolumeLevel.current > newPeakVolumeLevel.current) {
      updateValues(stopIntervals, startPeakVolumeTimeout, newPeakVolumeLevel, newVolumeLevel);
    }

    if (!isMicOn) resetValues(timerId, stopIntervals, newPeakVolumeLevel, newVolumeLevel);

    audioLevelElement.style.backgroundImage = `linear-gradient(to top, ${colorVolume} 0%,  ${colorVolume} ${newVolumeLevel.current}%, ${colorPeakVolume} 0%, ${colorPeakVolume} ${newPeakVolumeLevel.current}%, transparent ${newPeakVolumeLevel.current}%)`;
    audioLevelElement.setAttribute('aria-volume-level', String(100 - newVolumeLevel.current));
  }, 30);

  return { stopIntervals, timerId };
};
