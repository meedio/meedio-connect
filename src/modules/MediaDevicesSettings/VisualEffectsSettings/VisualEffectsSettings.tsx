import { supportsBackgroundProcessors } from '@livekit/track-processors';
import { useTranslation } from 'react-i18next';

import SettingsCard from 'modules/SettingsModal/SettingsCard/SettingsCard';

import SettingsBlurControls from './SettingsBlurControls';
import UnsupportedVisualEffects from './UnsupportedVisualEffects';
import CameraPreview from '../VideoSettings/CameraPreview';

const VisualEffectsSettings = () => {
  const { t } = useTranslation();

  const isProcessorSupported = supportsBackgroundProcessors();

  return (
    <SettingsCard>
      <SettingsCard.Content className="space-y-4">
        <CameraPreview camOffExplanation={t('effects_cam_off')} />
        {!isProcessorSupported ? (
          <UnsupportedVisualEffects />
        ) : (
          <>
            <SettingsCard.Content.DescriptionWrapper title={t('effects')} subtitle={t('effects_explanation')} />
            <SettingsBlurControls />
          </>
        )}
      </SettingsCard.Content>
    </SettingsCard>
  );
};

export default VisualEffectsSettings;
