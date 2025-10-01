import { useRoomContext } from '@livekit/components-react';
import { LocalTrackPublication, LocalVideoTrack, Track } from 'livekit-client';
import { useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { changeEffect } from 'components/VideoEffectsButton/utils';
import {
  useLiveKitDevicesStateContext,
  VideoEffectOptions,
} from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useToast from 'contexts/ToastProvider/useToast';
import logger from 'utils/logging/faro';

const useEffectChanges = () => {
  const { t } = useTranslation();
  const { backgroundProcessor, setBackgroundProcessor, videoEffect, loadingEffectIdRef } =
    useLiveKitDevicesStateContext();
  const { pushToast } = useToast();
  const hasMountedEffect = useRef(false);
  const room = useRoomContext();

  const handleEffectChange = useCallback(
    (effect: VideoEffectOptions, track?: LocalVideoTrack) => {
      // NOTE: setting effect might already be in progress, e.g. user changing video effect with camera off
      if (!track || !!loadingEffectIdRef.current) return;

      const errorText = t('blur_level_error');
      return changeEffect({
        effect,
        videoTrack: track,
        backgroundProcessorState: backgroundProcessor,
        setBackgroundProcessorState: setBackgroundProcessor,
      }).catch((e) => {
        logger.error('Could not apply video effect', e);
        return pushToast({ variant: 'error', title: errorText });
      });
    },
    [backgroundProcessor, loadingEffectIdRef, pushToast, setBackgroundProcessor, t],
  );

  const setEffect = useCallback(async () => {
    if (videoEffect === VideoEffectOptions.NONE || !room.localParticipant || hasMountedEffect.current) {
      return;
    }

    const localVideoTrack = room.localParticipant?.getTrackPublication(Track.Source.Camera)?.videoTrack;

    if (localVideoTrack && room.localParticipant.isCameraEnabled) {
      return localVideoTrack.once('elementAttached', () => handleEffectChange(videoEffect, localVideoTrack));
    }

    const onLocalTrackPublished = ({ videoTrack, kind }: LocalTrackPublication) => {
      // NOTE: event fires on published audio tracks as well, we need to check what kind of track was published
      if (kind === Track.Kind.Video) return handleEffectChange(videoEffect, videoTrack);

      room?.localParticipant.once('localTrackPublished', onLocalTrackPublished);
    };

    room?.localParticipant.once('localTrackPublished', onLocalTrackPublished);
  }, [videoEffect, room.localParticipant, handleEffectChange]);

  useEffect(() => {
    setEffect().then(() => (hasMountedEffect.current = true));
  }, [setEffect]);
};

export default useEffectChanges;
