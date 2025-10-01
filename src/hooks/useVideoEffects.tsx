import { useMaybeRoomContext } from '@livekit/components-react';
import { LocalVideoTrack, Track } from 'livekit-client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { isProcessorSupported, changeEffect } from 'components/VideoEffectsButton/utils';
import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import {
  useLiveKitDevicesStateContext,
  VideoEffectOptions,
} from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useToast from 'contexts/ToastProvider/useToast';

import useLivekitMediaDeviceToggle from './useLivekitMediaDeviceToggle';

export interface SetEffectProps {
  effect: VideoEffectOptions;
  isDeviceChange?: boolean;
  attachedElementsToWaitCount?: number;
}

const useVideoEffects = (videoTrack?: LocalVideoTrack) => {
  const { t } = useTranslation();
  const room = useMaybeRoomContext();
  const { pushToast } = useToast();
  const { isCameraBlocked, hasCameraPermissions } = useDevicePermissionsContext();
  const {
    options: videoOptions,
    isEnabled: isVideoEnabled,
    toggle: toggleCamera,
    devices,
  } = useLivekitMediaDeviceToggle({ kind: 'videoinput', room, hasPermissions: hasCameraPermissions });
  const {
    videoEffect,
    setVideoEffect: setVideoEffectState,
    backgroundProcessor,
    setBackgroundProcessor,
    loadingEffectId,
    setLoadingEffectId,
  } = useLiveKitDevicesStateContext();

  const isEffectUnavailable = isCameraBlocked || !hasCameraPermissions || !devices.length || !isProcessorSupported;

  const onEffect = useCallback(
    (effect: VideoEffectOptions, track?: LocalVideoTrack) => {
      if (!track) return;

      const errorText = t('blur_level_error');

      return changeEffect({
        effect,
        videoTrack: track,
        backgroundProcessorState: backgroundProcessor,
        setBackgroundProcessorState: setBackgroundProcessor,
      })
        .then(() => setVideoEffectState(effect))
        .catch(() => {
          pushToast({ variant: 'error', title: errorText });
        });
    },
    [backgroundProcessor, pushToast, setBackgroundProcessor, setVideoEffectState, t],
  );

  const handleEffectChange = async ({
    effect,
    isDeviceChange = false,
    attachedElementsToWaitCount = 1,
  }: SetEffectProps) => {
    const hasEffectAlready = videoEffect === effect && !isDeviceChange;
    const hasToWaitForAttachedElements = !isVideoEnabled || isDeviceChange;
    const hasRoom = room && room.state !== 'disconnected';

    if (!videoOptions.length || hasEffectAlready) return;

    if (hasToWaitForAttachedElements) {
      if (!isDeviceChange) {
        if (!hasRoom) setVideoEffectState(VideoEffectOptions.NONE);
        await toggleCamera();
      }

      if (videoTrack) {
        //NOTE: need to wait for track to be attached to the element to avoid effect error
        await new Promise((resolve) =>
          videoTrack.on('elementAttached', (element) => {
            if (videoTrack.attachedElements.length >= attachedElementsToWaitCount) resolve(element);
          }),
        );
      } else if (hasRoom) {
        //NOTE: user has joined without camera so he does not have video track, we should wait till he publishes it
        await new Promise(
          (resolve) => room?.localParticipant.once('localTrackPublished', () => resolve('track published')),
        );
      }
    }

    if (!videoTrack && hasRoom) {
      // NOTE: since joined without camera and turned it on in settings we should pick track from local participant
      const track = room.localParticipant.getTrackPublication(Track.Source.Camera)?.videoTrack;

      // NOTE: Toggle effect with track picked up from local participant
      return onEffect(effect, track);
    }

    //NOTE: handle case when video is off and not connected to room (i.e. premeeting/board guest in waiting list)
    if (!videoTrack) {
      if (backgroundProcessor) {
        backgroundProcessor.destroy();
        setBackgroundProcessor(undefined);
      }

      return setVideoEffectState(effect);
    }

    // NOTE: toggle effect if track has been defined before opening modal
    return onEffect(effect, videoTrack);
  };

  const setVideoEffect = ({ effect, isDeviceChange, attachedElementsToWaitCount }: SetEffectProps) => {
    setLoadingEffectId(effect);
    return handleEffectChange({ effect, isDeviceChange, attachedElementsToWaitCount }).finally(() =>
      setLoadingEffectId(undefined),
    );
  };

  return {
    videoEffect,
    setVideoEffect,
    loadingEffectId,
    isEffectUnavailable,
    isConfirmationNeeded: !isVideoEnabled,
  };
};

export default useVideoEffects;
