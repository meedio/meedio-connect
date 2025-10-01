import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';
import { LocalTrack } from 'livekit-client';
import { RefObject, createContext } from 'react';
import { useContext } from 'react';

import { VideoEffectOptions } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { SetState } from 'utils/types';

export type MediaDevicesSettingsContextType = {
  videoOptions: DropdownSelectionProps[];
  isVideoEnabled: boolean;
  toggleCamera: () => void;
  audioOptions: DropdownSelectionProps[];
  isAudioEnabled: boolean;
  toggleMicrophone: () => void;
  audioOutputOptions: DropdownSelectionProps[];
  handleVideoChange: (ref: RefObject<HTMLVideoElement>) => void;
  mediaStream?: MediaStream;
  previewAudioTrack?: LocalTrack;
  activeAudioInputId: string;
  activeAudioOutputId: string;
  videoEffect: VideoEffectOptions;
  setVideoEffect: SetState<VideoEffectOptions> | ((level: VideoEffectOptions) => Promise<void> | undefined);
  isVideoLoading?: boolean;
  isAudioLoading?: boolean;
  loadingEffectId?: VideoEffectOptions;
};

export const MediaDevicesSettingsContext = createContext<MediaDevicesSettingsContextType | null>(null);

export const useMediaDevicesSettingsContext = () => {
  const context = useContext(MediaDevicesSettingsContext);
  if (!context) throw new Error('useMediaDevicesSettingsContext must be used within a MediaDevicesSettingsContext');

  return context;
};
