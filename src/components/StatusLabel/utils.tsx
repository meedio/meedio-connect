import { TFunction } from 'i18next';

import { ReactComponent as MicOff } from 'assets/icons/MicrophoneOff.svg';
import { ReactComponent as VideoOff } from 'assets/icons/VideoOff.svg';

interface GetStatusLabelProps {
  isAcquiringTracks: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  t: TFunction<'translation', undefined>;
}
export const getStatusLabelProps = ({ t, isAcquiringTracks, isAudioOn, isVideoOn }: GetStatusLabelProps) => {
  if (isAcquiringTracks) return { text: t('waiting_for_permissions') };

  if (!isVideoOn && isAudioOn) {
    return {
      text: t('camera_off_notification'),
      icons: [VideoOff],
    };
  }

  if (!isAudioOn && isVideoOn) {
    return {
      text: t('microphone_off_notification'),
      icons: [MicOff],
    };
  }

  if (!isVideoOn && !isAudioOn) {
    return {
      text: t('mic_cam_off_notification'),
      icons: [VideoOff, MicOff],
    };
  }

  return {};
};

export default getStatusLabelProps;
