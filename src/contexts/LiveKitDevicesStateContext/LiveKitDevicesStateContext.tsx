import { ProcessorWrapper, BackgroundOptions } from '@livekit/track-processors';
import { createContext, MutableRefObject, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';

import { USER_CHOICES } from 'contexts/VideoGridContext/layoutUtils';
import useStateWithLocalStorage from 'hooks/useStateWithLocalStorage';
import { SetState } from 'utils/types';

import useLivekitActiveDeviceSync from './useLivekitActiveDeviceSync';

export enum VideoEffectOptions {
  NONE = 'NONE',
  BLUR_REGULAR = 'BLUR_REGULAR',
  BLUR_STRONG = 'BLUR_STRONG',
}

type LiveKitDevicesStateContext = {
  isVideoEnabled: boolean;
  setIsVideoEnabled: SetState<boolean>;
  videoDeviceId: string;
  setVideoDeviceId: SetState<string>;
  isAudioEnabled: boolean;
  setIsAudioEnabled: SetState<boolean>;
  audioDeviceId: string;
  setAudioDeviceId: SetState<string>;
  audioOutputId: string;
  setAudioOutputId: SetState<string>;
  isVideoLoading: boolean;
  setIsVideoLoading: SetState<boolean>;
  isAudioLoading: boolean;
  setIsAudioLoading: SetState<boolean>;
  videoEffect: VideoEffectOptions;
  setVideoEffect: SetState<VideoEffectOptions>;
  backgroundProcessor?: ProcessorWrapper<BackgroundOptions>;
  setBackgroundProcessor: SetState<ProcessorWrapper<BackgroundOptions> | undefined>;
  loadingEffectId?: VideoEffectOptions | undefined;
  setLoadingEffectId: SetState<VideoEffectOptions | undefined>;
  loadingEffectIdRef: MutableRefObject<VideoEffectOptions | undefined>;
};

const LiveKitDevicesStateContext = createContext<LiveKitDevicesStateContext | null>(null);

export const LiveKitDevicesStateProvider = ({ children }: PropsWithChildren) => {
  const [isVideoEnabled, setIsVideoEnabled] = useStateWithLocalStorage(USER_CHOICES.videoInput, true);
  const [isAudioEnabled, setIsAudioEnabled] = useStateWithLocalStorage(USER_CHOICES.audioInput, true);
  const [videoDeviceId, setVideoDeviceId] = useStateWithLocalStorage(USER_CHOICES.videoDeviceId, '');
  const [audioDeviceId, setAudioDeviceId] = useStateWithLocalStorage(USER_CHOICES.audioDeviceId, '');
  const [audioOutputId, setAudioOutputId] = useStateWithLocalStorage(USER_CHOICES.audioOutputId, 'default');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [videoEffect, setVideoEffect] = useState(VideoEffectOptions.NONE);
  const [backgroundProcessor, setBackgroundProcessor] = useState<ProcessorWrapper<BackgroundOptions>>();
  const [loadingEffectId, setLoadingEffectId] = useState<VideoEffectOptions>();
  const loadingEffectIdRef = useRef<VideoEffectOptions>();

  useLivekitActiveDeviceSync({ videoDeviceId, audioDeviceId, audioOutputId });

  // NOTE: need to have a reference to use in events
  useEffect(() => {
    loadingEffectIdRef.current = loadingEffectId;
  }, [loadingEffectId]);

  return (
    <LiveKitDevicesStateContext.Provider
      value={{
        isVideoEnabled,
        setIsVideoEnabled,
        videoDeviceId,
        setVideoDeviceId,
        isAudioEnabled,
        setIsAudioEnabled,
        audioDeviceId,
        setAudioDeviceId,
        audioOutputId,
        setAudioOutputId,
        isVideoLoading,
        setIsVideoLoading,
        isAudioLoading,
        setIsAudioLoading,
        videoEffect,
        setVideoEffect,
        backgroundProcessor,
        setBackgroundProcessor,
        loadingEffectId,
        setLoadingEffectId,
        loadingEffectIdRef,
      }}
    >
      {children}
    </LiveKitDevicesStateContext.Provider>
  );
};

export function useLiveKitDevicesStateContext() {
  const context = useContext(LiveKitDevicesStateContext);
  if (!context) throw new Error('useLiveKitDevicesStateContext must be used within a LiveKitDevicesStateProvider');

  return context;
}
