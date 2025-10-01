import { useCallback, useEffect, useState } from 'react';

import useReplaceSuspendedAnalyzer from './useReplaceSuspendedAnalyzer';
import { initializeAnalyser } from './utils';

const useInitializeAnalyser = (mediaStream?: MediaStream) => {
  const [analyser, setAnalyser] = useState<AnalyserNode>();
  const SMOOTHING_TIME_CONSTANT = 0.6;

  const setNewAnalyser = useCallback(() => {
    if (!mediaStream?.getAudioTracks().length) return;
    return setAnalyser(initializeAnalyser(mediaStream, SMOOTHING_TIME_CONSTANT));
  }, [mediaStream]);

  useReplaceSuspendedAnalyzer(analyser, setNewAnalyser);
  useEffect(() => {
    // NOTE: need to check for audio tracks also otherwise we crash when stream has only video track
    if (!mediaStream) return;

    setNewAnalyser();
    mediaStream.addEventListener('addtrack', setNewAnalyser);
    return () => mediaStream.removeEventListener('addtrack', setNewAnalyser);
  }, [mediaStream, setNewAnalyser]);

  return analyser;
};

export default useInitializeAnalyser;
