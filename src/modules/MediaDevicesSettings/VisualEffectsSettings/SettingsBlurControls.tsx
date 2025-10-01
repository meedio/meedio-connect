import { supportsBackgroundProcessors } from '@livekit/track-processors';
import { useTranslation } from 'react-i18next';

import { getBlurOptions } from 'components/VideoEffectsButton/utils';
import { useIsMobile } from 'hooks/useIsMobile';

import VisualEffectButton from './VisualEffectButton/VisualEffectButton';
import { useMediaDevicesSettingsContext } from '../MediaDevicesSettingsContext';
import OptionsDropdown from '../OptionsDropdown';

const SettingsBlurControls = () => {
  const { t } = useTranslation();
  const { videoEffect, setVideoEffect, videoOptions, loadingEffectId } = useMediaDevicesSettingsContext();
  const isMobile = useIsMobile();

  const iconClassName = 'mr-2 md:!mr-0 md:w-6 md:h-6 md:shrink-0 md:stroke-gray-80';
  const isProcessorSupported = supportsBackgroundProcessors();
  const isDisabled = !videoOptions.length || !isProcessorSupported;
  const blurOptions = isDisabled
    ? []
    : getBlurOptions({ blurLevel: videoEffect, setBlurLevel: setVideoEffect, iconClassName });

  if (isMobile) {
    return <OptionsDropdown title={t('blur.options')} options={blurOptions} disabledTitle={t('blur.disabled')} />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {blurOptions.map(({ title, icon, isSelected, onClick, level }) => {
        const isActive = isSelected;
        const isLoading = loadingEffectId === level;

        return (
          <VisualEffectButton
            key={title}
            isLoading={isLoading}
            title={title}
            isDisabled={!!loadingEffectId}
            isActive={isActive}
            onClick={onClick}
          >
            {icon}
          </VisualEffectButton>
        );
      })}
    </div>
  );
};

export default SettingsBlurControls;
