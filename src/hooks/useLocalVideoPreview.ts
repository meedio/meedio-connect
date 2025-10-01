import { useMediaDeviceSelect } from '@livekit/components-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { changeEffect } from 'components/VideoEffectsButton/utils';
import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import {
  useLiveKitDevicesStateContext,
  VideoEffectOptions,
} from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useToast from 'contexts/ToastProvider/useToast';
import { useTrackContext } from 'contexts/TrackContext/TrackContext';
import { getShouldMirrorVideo } from 'utils/tracks/utils';

import useVideoEffects from './useVideoEffects';

const useLocalVideoPreview = (isPlaceholder = false) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const { isVideoEnabled, backgroundProcessor, setBackgroundProcessor } = useLiveKitDevicesStateContext();
  const { videoTrack } = useTrackContext();
  const { hasCameraPermissions, hasMicrophonePermissions } = useDevicePermissionsContext();
  const videoDevices = useMediaDeviceSelect({ kind: 'videoinput', requestPermissions: hasCameraPermissions });
  const audioDevices = useMediaDeviceSelect({ kind: 'audioinput', requestPermissions: hasMicrophonePermissions });
  const [hasVideoDevices, hasAudioDevices] = [
    !!videoDevices.devices.length && hasCameraPermissions,
    !!audioDevices.devices.length && hasMicrophonePermissions,
  ];
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const { videoEffect } = useVideoEffects(videoTrack);

  const shouldMirrorVideo = getShouldMirrorVideo({ videoTrack, isScreenShareTile: false, isLocal: true });
  const shouldHideVideo = !isVideoEnabled || !hasVideoDevices || !videoTrack;
  const isVideoTrackLive = useMemo(() => videoTrack && videoTrack.mediaStreamTrack.readyState === 'live', [videoTrack]);

  const mountTrack = useCallback(async () => {
    if (internalVideoRef.current && videoTrack) {
      if (videoTrack.mediaStreamTrack.muted) await videoTrack.restartTrack();
      await videoTrack.unmute();
      videoTrack.attach(internalVideoRef.current);
    }
    //NOTE: shouldHideVideo required to rerender track after toggle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoTrack, shouldHideVideo]);

  useEffect(() => {
    if (
      videoEffect === VideoEffectOptions.NONE ||
      !isVideoEnabled ||
      videoTrack?.getProcessor() ||
      isPlaceholder ||
      !videoTrack ||
      !isVideoTrackLive
    ) {
      return;
    }

    const handleElementAttached = () =>
      changeEffect({
        effect: videoEffect,
        videoTrack,
        backgroundProcessorState: backgroundProcessor,
        setBackgroundProcessorState: setBackgroundProcessor,
      }).catch(() => pushToast({ variant: 'error', title: t('blur_level_error') }));

    videoTrack.once('elementAttached', handleElementAttached);
    return () => {
      videoTrack.off('elementAttached', handleElementAttached);
    };
  }, [
    backgroundProcessor,
    isPlaceholder,
    isVideoEnabled,
    isVideoTrackLive,
    pushToast,
    setBackgroundProcessor,
    t,
    videoEffect,
    videoTrack,
  ]);

  useEffect(() => {
    if (isPlaceholder || !isVideoTrackLive) return;

    mountTrack();

    const cleanupRef = internalVideoRef.current;
    return () => {
      if (videoTrack && cleanupRef) videoTrack.detach(cleanupRef);
    };
  }, [isPlaceholder, isVideoTrackLive, mountTrack, videoTrack]);

  return {
    shouldMirrorVideo,
    shouldHideVideo,
    hasAudioDevices,
    hasVideoDevices,
    internalVideoRef,
    videoTrack,
  };
};

export default useLocalVideoPreview;
