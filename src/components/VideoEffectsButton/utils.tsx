import {
  ProcessorWrapper,
  BackgroundOptions,
  BackgroundBlur,
  supportsBackgroundProcessors,
} from '@livekit/track-processors';
import { LocalVideoTrack } from 'livekit-client';

import { ReactComponent as NoBlur } from 'assets/icons/NoBlur.svg';
import { ReactComponent as RegularBlur } from 'assets/icons/RegularBlur.svg';
import { ReactComponent as StrongBlur } from 'assets/icons/StrongBlur.svg';
import { VideoEffectOptions } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import i18n from 'i18n/config';
import { SetState } from 'utils/types';

export const isProcessorSupported = supportsBackgroundProcessors();

const getRadiusFromLevel = (level: VideoEffectOptions) => {
  switch (level) {
    case VideoEffectOptions.NONE:
      return 0;
    case VideoEffectOptions.BLUR_REGULAR:
      return 10;
    case VideoEffectOptions.BLUR_STRONG:
      return 20;
    default:
      return 0;
  }
};

let updateEffectOptionsFn: (() => Promise<void> | undefined) | undefined;

type ChangeEffectProps = {
  effect: VideoEffectOptions;
  videoTrack: LocalVideoTrack;
  backgroundProcessorState?: ProcessorWrapper<BackgroundOptions>;
  setBackgroundProcessorState: SetState<ProcessorWrapper<BackgroundOptions> | undefined>;
};

export const changeEffect = async ({
  effect,
  videoTrack,
  backgroundProcessorState,
  setBackgroundProcessorState,
}: ChangeEffectProps) => {
  const radius = getRadiusFromLevel(effect);
  const isBlurEffect = getIsBlurEffect(effect);
  const isDisablingEffect = effect === VideoEffectOptions.NONE;

  if (updateEffectOptionsFn) videoTrack.off('restarted', updateEffectOptionsFn);

  if (isDisablingEffect) {
    await videoTrack.stopProcessor();
    if (backgroundProcessorState) await backgroundProcessorState.destroy();
    setBackgroundProcessorState(undefined);
    return;
  }

  let backgroundProcessor = backgroundProcessorState;

  if (!backgroundProcessorState && isBlurEffect) {
    backgroundProcessor = BackgroundBlur(radius, { delegate: 'GPU' });
    setBackgroundProcessorState(backgroundProcessor);
  }

  if (!backgroundProcessor) return;

  updateEffectOptionsFn = () => backgroundProcessor?.updateTransformerOptions({ blurRadius: radius });

  videoTrack.on('restarted', updateEffectOptionsFn);

  if (!videoTrack.getProcessor()) await videoTrack.setProcessor(backgroundProcessor);

  return updateEffectOptionsFn();
};

export const getIsBlurEffect = (effect: VideoEffectOptions) =>
  [VideoEffectOptions.BLUR_REGULAR, VideoEffectOptions.BLUR_STRONG].includes(effect);

interface BlurOptionsProps {
  blurLevel: VideoEffectOptions;
  setBlurLevel: SetState<VideoEffectOptions> | ((option: VideoEffectOptions) => void);
  iconClassName?: string;
}

export const getBlurOptions = ({ blurLevel, setBlurLevel, iconClassName }: BlurOptionsProps) => [
  {
    icon: <NoBlur className={iconClassName} />,
    title: i18n.t('blur.no_blur'),
    isSelected: blurLevel === VideoEffectOptions.NONE,
    onClick: () => setBlurLevel(VideoEffectOptions.NONE),
    level: VideoEffectOptions.NONE,
  },
  {
    icon: <RegularBlur className={iconClassName} />,
    title: i18n.t('blur.regular_blur'),
    isSelected: blurLevel === VideoEffectOptions.BLUR_REGULAR,
    onClick: () => setBlurLevel(VideoEffectOptions.BLUR_REGULAR),
    level: VideoEffectOptions.BLUR_REGULAR,
  },
  {
    icon: <StrongBlur className={iconClassName} />,
    title: i18n.t('blur.strong_blur'),
    isSelected: blurLevel === VideoEffectOptions.BLUR_STRONG,
    onClick: () => setBlurLevel(VideoEffectOptions.BLUR_STRONG),
    level: VideoEffectOptions.BLUR_STRONG,
  },
];
