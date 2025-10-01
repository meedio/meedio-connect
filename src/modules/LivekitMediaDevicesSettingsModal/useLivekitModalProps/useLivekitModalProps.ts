import { LocalVideoTrack, Room } from 'livekit-client';

import {
  useLiveKitDevicesStateContext,
  VideoEffectOptions,
} from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useVideoEffects from 'hooks/useVideoEffects';

import useLivekitModalAudioProps from './useLivekitModalAudioProps';
import useLivekitModalVideoProps from './useLivekitModalVideoProps';

const useLivekitModalProps = (room?: Room, videoTrack?: LocalVideoTrack) => {
  const { audioDeviceId: audioInputDeviceId } = useLiveKitDevicesStateContext();
  const { audioOptions, audioOutputOptions, isAudioEnabled, toggleMicrophone, audioOutputId } =
    useLivekitModalAudioProps(room);
  const { handleVideoChange, isVideoEnabled, toggleCamera, videoOptions } = useLivekitModalVideoProps(videoTrack, room);
  const { videoEffect, setVideoEffect: setEffect, loadingEffectId } = useVideoEffects(videoTrack);

  const setVideoEffect = (effect: VideoEffectOptions) => setEffect({ effect });

  return {
    audioInputDeviceId,
    audioOutputId,
    toggleCamera,
    toggleMicrophone,
    isAudioEnabled,
    isVideoEnabled,
    audioOptions,
    audioOutputOptions,
    videoOptions,
    handleVideoChange,
    loadingEffectId,
    videoEffect,
    setVideoEffect,
  };
};

export default useLivekitModalProps;
