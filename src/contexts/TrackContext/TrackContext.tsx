import { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

import { SetState } from 'utils/types';

interface TrackContextType {
  audioTrack?: LocalAudioTrack;
  setAudioTrack: SetState<LocalAudioTrack | undefined>;
  videoTrack?: LocalVideoTrack;
  setVideoTrack: SetState<LocalVideoTrack | undefined>;
  removeVideoTrack: () => void;
}

const TrackContext = createContext<TrackContextType | null>(null);

export const TrackContextProvider = ({ children }: PropsWithChildren) => {
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();

  const removeVideoTrack = useCallback(() => {
    if (!videoTrack) return;

    videoTrack.stop();
    setVideoTrack(undefined);
  }, [videoTrack]);

  useEffect(() => () => videoTrack?.stop(), [videoTrack]);

  useEffect(() => () => audioTrack?.stop(), [audioTrack]);

  return (
    <TrackContext.Provider
      value={{
        audioTrack,
        setAudioTrack,
        videoTrack,
        setVideoTrack,
        removeVideoTrack,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackContext = () => {
  const context = useContext(TrackContext);
  if (!context) throw new Error('useTrackContext must be used within a TrackContextProvider');

  return context;
};
