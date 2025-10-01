import { useTranslation } from 'react-i18next';

import { ReactComponent as Microphone } from 'assets/icons/MicrophoneWithShadow.svg';
import useVolumeIndicator from 'hooks/useVolumeIndicator/useVolumeIndicator';

import { useMediaDevicesSettingsContext } from '../MediaDevicesSettingsContext';

export const GRADIENT_COLORS: [string, string] = ['#ffffff80', '#ffffff4d'];

const MicrophoneIndicator = () => {
  const { t } = useTranslation();
  const { mediaStream, activeAudioInputId, previewAudioTrack } = useMediaDevicesSettingsContext();
  const ref = useVolumeIndicator(
    true,
    GRADIENT_COLORS,
    mediaStream || previewAudioTrack?.mediaStream,
    activeAudioInputId
  );

  if ((!mediaStream && previewAudioTrack?.isMuted) || (!mediaStream && !previewAudioTrack)) return null;

  return (
    <div className="md:-translate-y-2">
      <div className="bg-black80 w-[108px] overflow-hidden rounded-full">
        <div className="flex items-center justify-start p-0.5" ref={ref}>
          <div className="bg-white20 z-10 mr-1.5 rounded-full">
            <Microphone className="stroke-1.5 h-5 w-5 stroke-current text-white" />
          </div>
          <span className="text-size-xs text-shadow-icon z-10 truncate pr-1 text-white">{t('volume')}</span>
        </div>
      </div>
    </div>
  );
};

export default MicrophoneIndicator;
