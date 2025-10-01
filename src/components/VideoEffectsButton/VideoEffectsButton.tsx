import { useModal } from '@ebay/nice-modal-react';
import DropdownButton from '@shared/components/DropdownButton/DropdownButton';
import cx from 'classnames';
import { LocalVideoTrack } from 'livekit-client';
import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as AlertCircleFilled } from 'assets/icons/AlertCircleFilled.svg';
import { ReactComponent as Effects } from 'assets/icons/Effects.svg';
import FooterButton from 'components/FooterButton';
import {
  useLiveKitDevicesStateContext,
  VideoEffectOptions,
} from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { useTrackContext } from 'contexts/TrackContext/TrackContext';
import { useIsMobile } from 'hooks/useIsMobile';
import useTheme from 'hooks/useTheme';
import useVideoEffects from 'hooks/useVideoEffects';
import BlurOptionsPopup from 'modules/BlurOptionsPopup';
import VideoEffectConfirmationModal from 'modules/VideoEffectConfirmationModal';

import { getBlurOptions, getIsBlurEffect } from './utils';

type VideoEffectsButtonProps = {
  videoTrack?: LocalVideoTrack;
  isPreRoom?: boolean;
};

const VideoEffectsButton = ({
  videoTrack,
  isPreRoom = false,
}: VideoEffectsButtonProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { isLightTheme } = useTheme();
  const blurOptionsPopup = useModal(BlurOptionsPopup);
  const videoEffectConfirmationModal = useModal(VideoEffectConfirmationModal);
  const { isVideoLoading, isVideoEnabled } = useLiveKitDevicesStateContext();
  const { videoTrack: previewVideoTrack } = useTrackContext();
  const {
    videoEffect,
    setVideoEffect,
    isConfirmationNeeded,
    isEffectUnavailable,
    loadingEffectId,
  } = useVideoEffects(videoTrack || previewVideoTrack);

  const handleBlurChange = (level: VideoEffectOptions) => {
    if (!isConfirmationNeeded) return setVideoEffect({ effect: level });

    const onConfirm = () => {
      setVideoEffect({ effect: level });
      videoEffectConfirmationModal
        .hide()
        .then(videoEffectConfirmationModal.remove);
    };

    videoEffectConfirmationModal.show({ onConfirm });
  };

  const isBlurEnabled = getIsBlurEffect(videoEffect);
  const blurOptions = getBlurOptions({
    blurLevel: videoEffect,
    setBlurLevel: handleBlurChange,
    iconClassName: 'mr-2',
  });

  //NOTE: check if the preview track is present only in pre-room
  const hasNoPreviewVideoTrack =
    !previewVideoTrack ||
    (!videoTrack &&
      previewVideoTrack &&
      previewVideoTrack?.mediaStreamTrack.readyState === 'ended');

  const hasNoVideoTrack =
    isVideoEnabled && hasNoPreviewVideoTrack && !videoTrack;
  const isBlurButtonDisabled =
    isVideoLoading ||
    !!loadingEffectId ||
    hasNoVideoTrack ||
    isEffectUnavailable;

  const showPopup = (e: MouseEvent<HTMLButtonElement>) => {
    if (!isMobile) return;

    e.preventDefault();
    blurOptionsPopup.show({
      blurLevel: videoEffect,
      setBlurLevel: handleBlurChange,
    });
  };

  return (
    <DropdownButton
      disabled={isBlurButtonDisabled}
      options={blurOptions}
      aria-label={t('blur.options')}
      wrapperClassName=''
      className='min-w-[240px]'
      placement='top'
      openInPortal={isPreRoom}
    >
      {isEffectUnavailable && (
        <AlertCircleFilled className='absolute -right-[3px] -top-[3px] h-5 w-5 z-10 pointer-events-none' />
      )}
      <FooterButton
        onClick={showPopup}
        tooltipLabel={
          isEffectUnavailable ? t('blur.unsupported') : t('blur.options')
        }
        icon={Effects}
        tooltipType={isEffectUnavailable ? 'click' : 'hover'}
        disabled={isBlurButtonDisabled}
        className={cx('disabled:pointer-events-none disabled:!text-gray-50', {
          'bg-white20': isBlurEnabled,
          'hover:!bg-white10': isLightTheme && isPreRoom,
          'disabled:!bg-gray-40': isLightTheme && !isPreRoom,
          '!bg-gray-40': isLightTheme && !isPreRoom && isBlurEnabled,
        })}
        iconClassName={cx('!stroke-1.5', {
          'dark:!stroke-gray-50': isEffectUnavailable,
          'stroke-white': isLightTheme && isPreRoom,
        })}
        aria-label={t('blur.options')}
        data-component-name='Blur button'
      />
    </DropdownButton>
  );
};

export default VideoEffectsButton;
