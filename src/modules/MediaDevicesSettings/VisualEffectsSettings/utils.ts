import { VideoEffectOptions } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';

export const getIsBlurEffect = (effect: VideoEffectOptions) =>
  [VideoEffectOptions.BLUR_REGULAR, VideoEffectOptions.BLUR_STRONG].includes(effect);
