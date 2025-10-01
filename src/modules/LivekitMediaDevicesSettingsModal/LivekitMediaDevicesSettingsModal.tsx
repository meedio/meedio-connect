import { create, useModal } from '@ebay/nice-modal-react';
import { ConnectionState, Room, Track } from 'livekit-client';
import { useEffect } from 'react';

import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { useTrackContext } from 'contexts/TrackContext/TrackContext';
import MediaDevicesSettings from 'modules/MediaDevicesSettings/MediaDevicesSettings';
import { getIsMobile } from 'utils/browsers';
import logger from 'utils/logging/faro';

import useLivekitModalProps from './useLivekitModalProps/useLivekitModalProps';

export interface LivekitMediaDevicesSettingsModalProps {
  room?: Room;
}

const LivekitMediaDevicesSettingsModal = create(({ room }: LivekitMediaDevicesSettingsModalProps) => {
  const { remove } = useModal(LivekitMediaDevicesSettingsModal);
  const { isVideoLoading, isAudioLoading } = useLiveKitDevicesStateContext();
  const localParticipantVideoTrack = room?.localParticipant?.getTrackPublication(Track.Source.Camera)?.videoTrack;
  const localParticipantAudioTrack = room?.localParticipant?.getTrackPublication(Track.Source.Microphone)?.audioTrack;
  const { videoTrack, audioTrack } = useTrackContext();

  const isConnected =
    !!room &&
    [ConnectionState.Connected, ConnectionState.Reconnecting, ConnectionState.SignalReconnecting].includes(room.state);
  const videoTrackInProp = isConnected ? localParticipantVideoTrack : videoTrack;
  const audioTrackInProp = isConnected ? localParticipantAudioTrack : audioTrack;

  const {
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
    videoEffect,
    setVideoEffect,
    loadingEffectId,
  } = useLivekitModalProps(room, videoTrackInProp);
  const isSfuBlurEnabled = !!videoOptions.length && !getIsMobile();

  useEffect(() => {
    logger.info('Settings modal opened');

    return () => logger.info('Settings modal closed');
  }, []);

  return (
    <MediaDevicesSettings
      isBlurEnabled={isSfuBlurEnabled}
      onClose={remove}
      loadingEffectId={loadingEffectId}
      activeAudioInputId={audioInputDeviceId}
      activeAudioOutputId={audioOutputId}
      toggleCamera={toggleCamera}
      toggleMicrophone={toggleMicrophone}
      isAudioEnabled={isAudioEnabled}
      isVideoEnabled={isVideoEnabled}
      audioOptions={audioOptions}
      audioOutputOptions={audioOutputOptions}
      videoOptions={videoOptions}
      handleVideoChange={handleVideoChange}
      previewAudioTrack={audioTrackInProp}
      videoEffect={videoEffect}
      setVideoEffect={setVideoEffect}
      isVideoLoading={isVideoLoading}
      isAudioLoading={isAudioLoading}
    />
  );
});

export default LivekitMediaDevicesSettingsModal;
